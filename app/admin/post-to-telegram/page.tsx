"use client";

import { useState, useEffect } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Interface for job data
interface JobData {
  id: string;
  title: string;
  company: string;
  location?: string;
  telegramPosted?: boolean;
  [key: string]: any; // Allow for additional properties
}

export default function PostToTelegramPage() {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [result, setResult] = useState<{success?: boolean; message?: string} | null>(null);
  
  // Fetch recent jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Simplified query approach to avoid complex index requirements
        // First, get all jobs sorted by creation date
        const allJobsQuery = query(
          collection(db, "jobs"),
          orderBy("createdAt", "desc"),
          limit(50) // Get more jobs initially since we'll filter client-side
        );
        
        const snapshot = await getDocs(allJobsQuery);
        
        // Then filter out the ones that have already been posted to Telegram (client-side filtering)
        const jobsList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as JobData))
          .filter(job => !job.telegramPosted) // Filter client-side
          .slice(0, 20); // Limit to 20 jobs for display
        
        setJobs(jobsList);
        if (jobsList.length > 0) {
          setSelectedJobId(jobsList[0].id);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    
    fetchJobs();
  }, []);
  
  const handlePostToTelegram = async () => {
    if (!selectedJobId) {
      setResult({success: false, message: "Please select a job"});
      return;
    }
    
    setLoading(true);
    setResult(null);
    
    try {
      const functions = getFunctions();
      const manualPostJob = httpsCallable(functions, 'manualPostJobToTelegram');
      
      const response = await manualPostJob({ jobId: selectedJobId });
      setResult({
        success: true,
        message: "Job posted to Telegram successfully!"
      });
      
      // Remove the job from the list
      setJobs(jobs.filter(job => job.id !== selectedJobId));
      // Select the next job if available
      if (jobs.length > 1) {
        setSelectedJobId(jobs[0].id === selectedJobId ? jobs[1].id : jobs[0].id);
      } else {
        setSelectedJobId("");
      }
    } catch (error: any) {
      console.error("Error posting to Telegram:", error);
      setResult({
        success: false,
        message: `Error: ${error.message || "Unknown error occurred"}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold mb-6">Post Jobs to Telegram</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a Job to Post</h2>
        
        {jobs.length > 0 ? (
          <>
            <div className="mb-4">
              <label htmlFor="jobSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Job
              </label>
              <select
                id="jobSelect"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
              >
                {jobs.map(job => (
                  <option key={job.id} value={job.id}>
                    {job.title} at {job.company}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedJobId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Job Preview</h3>
                {jobs.find(job => job.id === selectedJobId) && (
                  <div>
                    <p><strong>Title:</strong> {jobs.find(job => job.id === selectedJobId)?.title}</p>
                    <p><strong>Company:</strong> {jobs.find(job => job.id === selectedJobId)?.company}</p>
                    <p><strong>Location:</strong> {jobs.find(job => job.id === selectedJobId)?.location || "Not specified"}</p>
                  </div>
                )}
              </div>
            )}
            
            <button
              className={`w-full py-2 px-4 rounded-md font-medium ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
              onClick={handlePostToTelegram}
              disabled={loading || !selectedJobId}
            >
              {loading ? "Posting..." : "Post to Telegram"}
            </button>
          </>
        ) : (
          <p className="text-gray-600">No jobs available to post to Telegram.</p>
        )}
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {result.message}
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-md">
        <h2 className="text-lg font-semibold mb-2">About This Feature</h2>
        <p className="text-sm text-gray-700">
          This tool allows you to manually post jobs to your Telegram channel. New jobs are automatically 
          posted when they are created, but you can use this page to repost jobs or post jobs that 
          were missed by the automatic process.
        </p>
      </div>
    </div>
  );
} 