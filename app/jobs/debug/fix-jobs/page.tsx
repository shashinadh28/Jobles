"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function FixJobsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ 
    success?: boolean; 
    error?: string; 
    fixedJobs?: { id: string, title: string, before: any, after: any }[] 
  }>({});

  const fixAllJobs = async () => {
    try {
      setIsLoading(true);
      setResult({});
      
      const fixedJobs: { id: string, title: string, before: any, after: any }[] = [];

      // Get all jobs from Firestore
      const jobsSnapshot = await getDocs(collection(db, "jobs"));
      console.log(`Found ${jobsSnapshot.docs.length} jobs to fix`);
      
      // Process each job
      for (const jobDoc of jobsSnapshot.docs) {
        const jobData = jobDoc.data();
        
        // Store original values for logging
        const beforeFix = {
          category: jobData.category,
          postedAt: jobData.postedAt,
          deadline: jobData.deadline
        };
        
        // Changes to make:
        const updates: Record<string, any> = {};
        
        // 1. Make category lowercase
        if (jobData.category && jobData.category !== jobData.category.toLowerCase()) {
          updates.category = jobData.category.toLowerCase();
        }
        
        // 2. Fix dates if they're in the future or missing
        const now = new Date();
        
        // Check if postedAt is in the future or missing
        if (!jobData.postedAt || 
            (jobData.postedAt.toDate && jobData.postedAt.toDate() > now)) {
          // Set to a random date between 1-30 days ago to spread them out
          const daysAgo = Math.floor(Math.random() * 30) + 1; // At least 1 day ago, up to 30 days ago
          const pastDate = new Date();
          pastDate.setDate(pastDate.getDate() - daysAgo);
          updates.postedAt = Timestamp.fromDate(pastDate);
          console.log(`Changed job date from ${jobData.postedAt?.toDate?.().toISOString() || 'none'} to ${pastDate.toISOString()} (${daysAgo} days ago)`);
        }
        
        // Only update if we have changes to make
        if (Object.keys(updates).length > 0) {
          console.log(`Fixing job: ${jobDoc.id} (${jobData.title})`, updates);
          
          try {
            await updateDoc(doc(db, "jobs", jobDoc.id), updates);
            
            fixedJobs.push({
              id: jobDoc.id,
              title: jobData.title,
              before: beforeFix,
              after: {
                category: updates.category || jobData.category,
                postedAt: updates.postedAt || jobData.postedAt,
                deadline: updates.deadline || jobData.deadline
              }
            });
          } catch (err) {
            console.error(`Error updating job ${jobDoc.id}:`, err);
          }
        } else {
          console.log(`No changes needed for job: ${jobDoc.id} (${jobData.title})`);
        }
      }

      setResult({ 
        success: true, 
        fixedJobs 
      });
      
    } catch (error) {
      console.error("Error fixing jobs:", error);
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
      <h1 className="text-3xl font-bold mb-8">Fix All Jobs</h1>
      
      <div className="mb-8">
        <p className="mb-4 text-red-600 font-bold">
          This utility will fix all your jobs in the Firestore database:
        </p>
        
        <ul className="list-disc pl-5 mb-6">
          <li>Convert all categories to lowercase</li>
          <li>Fix future dates to be in the past (0-7 days ago)</li>
        </ul>
        
        <button
          onClick={fixAllJobs}
          disabled={isLoading}
          className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {isLoading ? "Fixing Jobs..." : "Fix All Jobs Now"}
        </button>
      </div>
      
      {result.success && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-md mb-4">
          <h3 className="font-semibold text-green-800 text-xl mb-3">Success!</h3>
          
          {result.fixedJobs && result.fixedJobs.length > 0 ? (
            <>
              <p className="mb-3">Fixed {result.fixedJobs.length} jobs:</p>
              
              <div className="max-h-96 overflow-y-auto border border-green-200 rounded p-4 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3">ID</th>
                      <th className="text-left py-2 px-3">Title</th>
                      <th className="text-left py-2 px-3">Changes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.fixedJobs.map((job) => (
                      <tr key={job.id} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-3 font-mono text-xs">{job.id}</td>
                        <td className="py-2 px-3">{job.title}</td>
                        <td className="py-2 px-3">
                          {job.before.category !== job.after.category && (
                            <div className="mb-1">
                              <span className="font-semibold">Category:</span>{" "}
                              <span className="line-through text-red-600">{job.before.category}</span>{" "}
                              → <span className="text-green-600">{job.after.category}</span>
                            </div>
                          )}
                          
                          {job.before.postedAt !== job.after.postedAt && (
                            <div>
                              <span className="font-semibold">Posted Date:</span>{" "}
                              <span className="line-through text-red-600">
                                {job.before.postedAt?.toDate ? 
                                  job.before.postedAt.toDate().toLocaleDateString() : 
                                  "missing"}
                              </span>{" "}
                              → <span className="text-green-600">
                                {job.after.postedAt?.toDate ? 
                                  job.after.postedAt.toDate().toLocaleDateString() : 
                                  "now"}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <p>No jobs needed fixing! All jobs are already in the correct format.</p>
          )}
          
          <div className="mt-4">
            <a 
              href="/jobs/debug" 
              className="text-blue-600 hover:underline mr-4"
            >
              View Debug Page
            </a>
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
    </div>
  );
} 