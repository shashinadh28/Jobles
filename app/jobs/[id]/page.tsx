"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getJobById } from "@/lib/firestore";
import { Briefcase, Building, MapPin, CalendarClock, Clock, ArrowLeft, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Job } from "@/lib/firestore";
import { trackJobView } from "@/lib/analytics";

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!params.id) {
          throw new Error('No job ID provided');
        }
        
        const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
        setLoading(true);
        const jobData = await getJobById(jobId);
        
        if (!jobData) {
          throw new Error('Job not found');
        }
        
        setJob(jobData);
        
        // Track job view in Google Analytics
        trackJobView(
          jobId, 
          jobData.title || 'Unknown Job', 
          jobData.company || 'Unknown Company'
        );
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. The job may have been removed or doesn\'t exist.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [params.id]);
  
  const formattedPostedDate = job?.postedAt instanceof Date
    ? job.postedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Recently';
    
  const formattedDeadlineDate = job?.deadline instanceof Date 
    ? job.deadline.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : job?.deadline 
      ? typeof job.deadline === 'string' 
        ? new Date(job.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) 
        : String(job.deadline)
      : 'No deadline specified';
    
  // Function to determine if a URL is a data URL
  const isDataUrl = (url?: string) => url?.startsWith('data:');
  
  // Function to determine if a URL is a remote URL
  const isRemoteUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Function to handle reporting expired job
  const handleReportExpiredJob = async () => {
    if (!job || !params.id) return;
    
    const jobId = Array.isArray(params.id) ? params.id[0] : params.id;
    
    setReportLoading(true);
    
    try {
      // Send the report to the server
      const response = await fetch('/api/report-expired-job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobId,
          jobTitle: job.title,
          company: job.company,
        }),
      });
      
      if (response.ok) {
        setReportSubmitted(true);
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again later.');
    } finally {
      setReportLoading(false);
      setTimeout(() => {
        setReportModalOpen(false);
      }, 3000); // Close modal after 3 seconds
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-red-50 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            {error || 'Job not found'}
          </h1>
          <p className="mb-6 text-red-600">
            The job you're looking for couldn't be found. It may have been removed or doesn't exist.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-all">
          {/* Header */}
          <div className="border-b border-gray-200 p-8 pb-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Company Logo */}
              <div className="w-48 h-48 flex items-center justify-center bg-white rounded-lg p-4 shadow">
                {job.logoUrl && !logoError ? (
                  isDataUrl(job.logoUrl) ? (
                    <img
                      src={job.logoUrl}
                      alt={`${job.company} logo`}
                      className="w-full h-full object-contain"
                      onError={() => setLogoError(true)}
                    />
                  ) : isRemoteUrl(job.logoUrl) ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={job.logoUrl}
                        alt={`${job.company} logo`}
                        width={160}
                        height={160}
                        className="object-contain"
                        onError={() => setLogoError(true)}
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-4xl font-bold text-gray-500">{job.company?.substring(0, 2)}</span>
                    </div>
                  )
                ) : (
                  <Building className="w-20 h-20 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <h2 className="text-xl text-gray-700 mb-4">
                  {job.company}
                </h2>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{job.jobType}</span>
                  </div>
                  
                  {job.experienceLevel && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{job.experienceLevel}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-600">
                    <CalendarClock className="w-4 h-4 mr-1" />
                    <span>Posted on {formattedPostedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="p-8">
            {/* Report Expired Job Button */}
            <div className="mb-4 flex items-center justify-end">
              <button
                onClick={() => setReportModalOpen(true)}
                className="text-red-600 hover:text-red-800 flex items-center text-sm font-medium"
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Report expired job
              </button>
            </div>
            
            {/* Salary & Deadline & Apply Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 rounded-lg mb-8">
              {job.salary && (
                <div className="mb-4 sm:mb-0">
                  <div className="text-sm text-gray-600">Salary</div>
                  <div className="text-xl font-bold text-green-600">{job.salary}</div>
                </div>
              )}
              
              {job.deadline && (
                <div className="mb-4 sm:mb-0">
                  <div className="text-sm text-gray-600">Application Deadline</div>
                  <div className="text-base font-medium">{formattedDeadlineDate}</div>
                </div>
              )}
              
              {job.applicationLink && (
                <a
                  href={job.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </a>
              )}
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Job Description</h3>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{job.description}</p>
              </div>
            </div>
            
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Preferred qualifications</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.responsibilities.map((resp, index) => (
                    <li key={index} className="text-gray-700">{resp}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* CTA Section */}
            <div className="mt-10 border-t border-gray-200 pt-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-blue-800 mb-2">
                  Interested in this position?
                </h3>
                <p className="text-blue-700 mb-4">
                  Apply now to join {job.company} as a {job.title}.
                </p>
                {job.applicationLink ? (
                  <a
                    href={job.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
                  >
                    Apply Now
                  </a>
                ) : (
                  <p className="text-sm text-gray-600">
                    For application information, please contact the employer directly.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Report Expired Job Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            {!reportSubmitted ? (
              <>
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                  Report Expired Job
                </h3>
                <p className="mb-6 text-gray-700">
                  Is this job posting expired or unavailable? Reporting it will help us keep our job listings current and relevant.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReportExpiredJob}
                    disabled={reportLoading}
                    className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 ${
                      reportLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {reportLoading ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="mb-4 text-green-600 flex justify-center">
                  <svg 
                    className="w-16 h-16" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p className="text-gray-700">
                  Your report has been submitted successfully. We'll review this job posting soon.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 