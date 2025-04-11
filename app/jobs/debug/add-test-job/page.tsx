"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AddTestJobPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; error?: string; jobId?: string }>({});

  const addTestJob = async () => {
    try {
      setIsLoading(true);
      setResult({});

      // Create a test job with proper lowercase category and past date
      const jobData = {
        title: "Test Internship Job - TODAY",
        company: "Test Company",
        location: "Remote",
        jobType: "internship",
        category: "internship", // Lowercase is important
        salary: "₹15,000/month",
        description: "This is a test internship job created via the debug page with a GUARANTEED PAST DATE.",
        requirements: ["Basic programming skills", "Good communication"],
        experienceLevel: "Entry Level",
        skills: ["React", "JavaScript"],
        postedAt: Timestamp.fromDate(new Date(Date.now() - 1000 * 60 * 60 * 24)), // Yesterday's date - GUARANTEED to be in the past
        deadline: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 days from now
        status: "active"
      };

      console.log("Adding test job:", jobData);
      
      // Save to Firestore
      const jobsRef = collection(db, "jobs");
      const docRef = await addDoc(jobsRef, jobData);
      
      console.log("Test job added with ID:", docRef.id);
      setResult({ 
        success: true, 
        jobId: docRef.id 
      });
    } catch (error) {
      console.error("Error adding test job:", error);
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Add Test Internship Job with GUARANTEED Past Date</h1>
      
      <div className="mb-8">
        <p className="mb-4 text-red-600 font-bold">
          Your existing jobs have future dates (April 6, 2025) which is why they aren't showing up!
        </p>
        <p className="mb-4">
          This page will add a test internship job with YESTERDAY'S DATE to Firestore with the correct lowercase category.
        </p>
        
        <button
          onClick={addTestJob}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "Add Test Internship Job with YESTERDAY'S DATE"}
        </button>
      </div>
      
      {result.success && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-md mb-4">
          <h3 className="font-semibold text-green-800">Success!</h3>
          <p>Test job added with ID: {result.jobId}</p>
          <div className="mt-4">
            <a 
              href="/jobs/debug" 
              className="text-blue-600 hover:underline"
            >
              View in Debug Page
            </a>
            <span className="mx-2">|</span>
            <a 
              href="/" 
              className="text-blue-600 hover:underline"
            >
              Go to Home Page
            </a>
          </div>
        </div>
      )}
      
      {result.error && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-md mb-4">
          <h3 className="font-semibold text-red-800">Error</h3>
          <p>{result.error}</p>
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-md">
        <h3 className="font-semibold mb-2">Important Notes:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>The job will be created with the category set to lowercase "internship"</li>
          <li className="font-bold text-red-600">The job will have YESTERDAY'S date as the posting date (guaranteed to be in the past)</li>
          <li>After adding the job, check the debug page to verify it was added correctly</li>
          <li>Then go to the home page and click on the "Internships" tab to see if it appears</li>
        </ul>
      </div>
    </div>
  );
} 