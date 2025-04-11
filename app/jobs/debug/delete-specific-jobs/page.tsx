"use client";

import { useState } from "react";
import { collection, getDocs, deleteDoc, doc, Firestore } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DeleteSpecificJobsPage() {
  const [loading, setLoading] = useState(false);
  const [deletedJobs, setDeletedJobs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const jobsToDelete = [
    "Software Engineer Intern (Summer 2025)",
    "Google Hiring Web Solutions Engineer, University Graduate, 2025",
    "Junior Climate Analyst"
  ];

  const deleteSpecificJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!db || typeof db === 'object' && Object.keys(db).length === 0) {
        throw new Error("Firebase is not initialized");
      }
      
      const jobsCollection = collection(db as Firestore, "jobs");
      const jobsSnapshot = await getDocs(jobsCollection);
      
      const deletedJobIds: string[] = [];
      
      for (const jobDoc of jobsSnapshot.docs) {
        const jobData = jobDoc.data();
        if (jobsToDelete.includes(jobData.title)) {
          await deleteDoc(doc(db as Firestore, "jobs", jobDoc.id));
          deletedJobIds.push(jobDoc.id);
          console.log(`Deleted job: ${jobData.title} (ID: ${jobDoc.id})`);
        }
      }
      
      setDeletedJobs(deletedJobIds);
      
      if (deletedJobIds.length === 0) {
        setError("No matching jobs found to delete.");
      }
    } catch (err) {
      console.error("Error deleting jobs:", err);
      setError("Failed to delete jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Delete Specific Jobs</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Jobs to be deleted:</h2>
        <ul className="list-disc pl-6 mb-6">
          {jobsToDelete.map((job, index) => (
            <li key={index} className="mb-2">{job}</li>
          ))}
        </ul>
        
        <button
          onClick={deleteSpecificJobs}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Delete These Jobs"}
        </button>
      </div>
      
      {deletedJobs.length > 0 && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-md mb-4">
          <h3 className="font-semibold text-green-800">Success!</h3>
          <p>Deleted {deletedJobs.length} jobs:</p>
          <ul className="list-disc pl-6 mt-2">
            {deletedJobs.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-200 rounded-md mb-4">
          <h3 className="font-semibold text-red-800">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <div className="mt-8">
        <a 
          href="/" 
          className="text-blue-600 hover:underline"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  );
} 