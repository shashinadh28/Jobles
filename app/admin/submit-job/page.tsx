"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Upload } from "lucide-react";
import Link from "next/link";
import { addDoc, collection, Timestamp, Firestore } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, FirebaseStorage } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import Image from "next/image";
import { notifySubscribers } from '@/lib/notifications';

export default function SubmitJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "full-time", // default value
    category: "fresher", // default value
    batchYear: "",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: "", // New field for responsibilities
    experienceLevel: "Entry Level", // default value
    skills: "",
    deadline: "",
    applicationLink: "",
    logoUrl: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setLogoError("File size exceeds 2MB limit");
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setLogoError("Only image files are allowed");
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoPreview(event.target.result as string);
        }
      };
      reader.onerror = () => {
        setLogoError("Failed to read file");
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    try {
      setUploadingLogo(true);
      
      // Instead of uploading to Firebase Storage directly, we'll use the data URL
      // This bypasses the CORS issues with Firebase Storage
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            // Return the data URL as the logo URL
            resolve(event.target.result as string);
          } else {
            resolve(null);
          }
        };
        reader.onerror = () => {
          console.error("Error reading file as data URL");
          resolve(null);
        };
        reader.readAsDataURL(logoFile);
      });
      
      /* Original Firebase Storage code - commented out due to CORS issues
      // Create a reference to the file location in Firebase Storage
      const storageRef = ref(storage, `company-logos/${Date.now()}-${logoFile.name}`);
      
      // Upload the file
      const snapshot = await uploadBytes(storageRef, logoFile);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
      */
    } catch (error) {
      console.error("Error handling logo:", error);
      setLogoError("Failed to process logo: " + (error instanceof Error ? error.message : "Unknown error"));
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setLogoError(null);

    try {
      // Check if online
      if (typeof window !== 'undefined' && !window.navigator.onLine) {
        throw new Error("You appear to be offline. Please check your internet connection and try again.");
      }
      
      // Upload logo if provided
      let logoUrl = formData.logoUrl;
      if (logoFile) {
        try {
          const uploadedUrl = await uploadLogo();
          if (uploadedUrl) {
            logoUrl = uploadedUrl;
          } else if (!logoUrl) {
            // If upload failed and no fallback URL
            throw new Error("Logo upload failed and no URL provided");
          }
        } catch (uploadError) {
          console.error("Logo upload error:", uploadError);
          setLogoError("Failed to upload logo. Using URL if provided.");
          // Continue with form submission if URL is provided as fallback
          if (!logoUrl) {
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Prepare data for submission
      const jobData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        jobType: formData.jobType,
        category: formData.category.toLowerCase(),
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').filter(Boolean), // Process responsibilities
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        // Always use current time for posted date
        postedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60)), // One hour ago
        // Optional fields
        batchYear: formData.batchYear || null,
        salary: formData.salary || null,
        experienceLevel: formData.experienceLevel || null,
        applicationLink: formData.applicationLink || null,
        logoUrl: logoUrl || null,
        deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null,
        status: "active" // Default status for new jobs
      };

      console.log("Submitting job data:", jobData);

      try {
        // Save job to Firestore with timeout handling
        const jobsRef = collection(db as Firestore, "jobs");
        
        // Use a timeout promise to prevent hanging
        const addDocPromise = addDoc(jobsRef, jobData);
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Operation timed out after 15 seconds")), 15000);
        });
        
        // Race the promises
        const docRef = await Promise.race([addDocPromise, timeoutPromise]) as any;
        
        console.log("Job posted successfully to Firestore with ID:", docRef.id);
        
        // Send notifications to subscribers
        const notificationResult = await notifySubscribers({
          ...jobData,
          id: docRef.id
        });
        
        if (!notificationResult.success) {
          console.warn("Failed to send notifications:", notificationResult.message);
        }
        
        setSubmitSuccess(true);
      } catch (firestoreError) {
        console.error("Firestore error:", firestoreError);
        throw new Error(`Database error: ${firestoreError instanceof Error ? firestoreError.message : 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      if (error instanceof Error) {
        setSubmitError(`Failed to submit job: ${error.message}`);
      } else {
        setSubmitError("Failed to submit job. Please try again.");
      }
      // Force re-enable the submit button after delay
      setTimeout(() => setIsSubmitting(false), 1000);
    } finally {
      // This may not run if there are Firebase connectivity issues
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-4">Submit New Job</h1>
          <p className="text-gray-600">Fill out the form below to add a new job listing to the platform.</p>
        </div>

        {submitSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold text-green-800 mb-2">Job Posted Successfully!</h3>
            <p className="text-green-700 mb-4">Your job listing has been added to the platform.</p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setSubmitSuccess(false);
                  setFormData({
                    title: "",
                    company: "",
                    location: "",
                    jobType: "full-time",
                    category: "fresher",
                    batchYear: "",
                    salary: "",
                    description: "",
                    requirements: "",
                    responsibilities: "",
                    experienceLevel: "Entry Level",
                    skills: "",
                    deadline: "",
                    applicationLink: "",
                    logoUrl: ""
                  });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Add Another Job
              </button>
              <Link href="/admin/jobs" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                View All Jobs
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-md p-8">
            {/* Error message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="mb-2">{submitError}</p>
                {isSubmitting && (
                  <button
                    type="button"
                    onClick={() => setIsSubmitting(false)}
                    className="text-sm font-medium underline"
                  >
                    Reset Form
                  </button>
                )}
              </div>
            )}

            {/* Basic job information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title*
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Frontend Developer"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name*
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. TechCorp"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location*
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. Bengaluru"
                  />
                </div>
                
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. ₹5-7 LPA or ₹20,000/month"
                  />
                </div>
              </div>
            </div>
            
            {/* Job type and category */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Job Classification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type*
                  </label>
                  <select
                    id="jobType"
                    name="jobType"
                    required
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category*
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="fresher">Fresher</option>
                    <option value="wfh">Work From Home</option>
                    <option value="internship">Internship</option>
                    <option value="experienced">Experienced</option>
                  </select>
                </div>
                
                {formData.category === "fresher" && (
                  <div>
                    <label htmlFor="batchYear" className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Year
                    </label>
                    <select
                      id="batchYear"
                      name="batchYear"
                      value={formData.batchYear}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Any Batch Year</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                      <option value="2025">2025</option>
                      <option value="2026">2026</option>
                      <option value="2027">2027</option>
                    </select>
                  </div>
                )}
                
                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    id="experienceLevel"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Entry Level">Entry Level (0-2 years)</option>
                    <option value="Mid Level">Mid Level (2-5 years)</option>
                    <option value="Senior Level">Senior Level (5+ years)</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Job description and details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Job Description & Details</h2>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description*
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide a detailed description of the job..."
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred qualifications
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  required
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bachelor's degree in Computer Science
Experience with React.js
Strong problem-solving skills"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">Add one qualification per line</p>
              </div>
              
              <div>
                <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  required
                  rows={4}
                  value={formData.responsibilities}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Develop and maintain web applications
Collaborate with cross-functional teams
Implement responsive designs"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">Add one responsibility per line</p>
              </div>
              
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. React, JavaScript, CSS, HTML"
                />
                <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
              </div>
            </div>
            
            {/* Application details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Application Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="applicationLink" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Link or Email
                  </label>
                  <input
                    type="text"
                    id="applicationLink"
                    name="applicationLink"
                    value={formData.applicationLink}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. https://company.com/careers or careers@company.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Company logo */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold border-b pb-2">Company Branding</h2>
              
              <div>
                <label htmlFor="logoUpload" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo
                </label>
                
                <div className="mt-1 flex items-center space-x-6">
                  {/* Logo preview */}
                  {logoPreview && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border border-gray-200">
                      <Image 
                        src={logoPreview} 
                        alt="Logo preview" 
                        width={96}
                        height={96}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex flex-col">
                    {/* Upload button */}
                    <label 
                      htmlFor="logoUpload" 
                      className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <span className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        {logoFile ? 'Change logo' : 'Upload logo'}
                      </span>
                      <input
                        id="logoUpload"
                        name="logoUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="sr-only"
                      />
                    </label>
                    
                    {logoFile && (
                      <p className="mt-2 text-xs text-gray-500">
                        {logoFile.name} ({Math.round(logoFile.size / 1024)} KB)
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Logo error message */}
                {logoError && (
                  <p className="mt-2 text-sm text-red-600">
                    {logoError}
                  </p>
                )}
                
                <p className="mt-1 text-sm text-gray-500">
                  Upload your company logo (PNG or JPG, max 2MB)
                </p>
                
                {/* Keep the URL option as a fallback */}
                <div className="mt-4">
                  <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">
                    Or enter logo URL (optional)
                  </label>
                  <input
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    value={formData.logoUrl}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. https://company.com/logo.png"
                  />
                </div>
              </div>
            </div>
            
            {/* Submit button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-blue-600 rounded-md text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 