"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const jobsQuery = query(
          collection(db, "jobs"),
          orderBy("postedAt", "desc")
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        
        const jobsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setJobs(jobsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Jobs Data</h1>
      
      {loading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          <div>Total Jobs: {jobs.length}</div>
          
          {jobs.map(job => (
            <div key={job.id} className="p-4 border rounded-md">
              <div className="font-bold">{job.title}</div>
              <div>{job.company}</div>
              <div>Location: {job.location}</div>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(job, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}