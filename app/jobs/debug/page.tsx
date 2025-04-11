"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        console.log("Fetching jobs from Firestore...");
        
        // Get jobs from Firestore
        const jobsQuery = query(
          collection(db, "jobs"),
          orderBy("postedAt", "desc")
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        console.log("Query snapshot:", querySnapshot);
        
        const jobsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Format dates for display
            postedAt: data.postedAt?.toDate ? data.postedAt.toDate().toLocaleString() : "No date",
            deadline: data.deadline?.toDate ? data.deadline.toDate().toLocaleString() : "No deadline"
          };
        });
        
        console.log("Jobs list:", jobsList);
        setJobs(jobsList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Jobs Data</h1>
      
      {loading ? (
        <div className="text-xl">Loading jobs data...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Total Jobs: {jobs.length}</h2>
          </div>
          
          {jobs.length === 0 ? (
            <div className="bg-yellow-100 p-4 rounded-md">
              <p className="text-yellow-700">No jobs found in Firestore database.</p>
              <p className="mt-2">Possible reasons:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>The job wasn't successfully saved to Firestore</li>
                <li>There's an issue with Firestore permissions</li>
                <li>The database connection isn't properly configured</li>
              </ul>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Company</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Posted At</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td className="px-4 py-2 border">{job.id}</td>
                      <td className="px-4 py-2 border">{job.title}</td>
                      <td className="px-4 py-2 border">{job.company}</td>
                      <td className="px-4 py-2 border">{job.category}</td>
                      <td className="px-4 py-2 border">{job.postedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Raw Data:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(jobs, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        console.log("Fetching jobs from Firestore...");
        
        // Get jobs from Firestore
        const jobsQuery = query(
          collection(db, "jobs"),
          orderBy("postedAt", "desc")
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        console.log("Query snapshot:", querySnapshot);
        
        const jobsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Format dates for display
            postedAt: data.postedAt?.toDate ? data.postedAt.toDate().toLocaleString() : "No date",
            deadline: data.deadline?.toDate ? data.deadline.toDate().toLocaleString() : "No deadline"
          };
        });
        
        console.log("Jobs list:", jobsList);
        setJobs(jobsList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Jobs Data</h1>
      
      {loading ? (
        <div className="text-xl">Loading jobs data...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Total Jobs: {jobs.length}</h2>
          </div>
          
          {jobs.length === 0 ? (
            <div className="bg-yellow-100 p-4 rounded-md">
              <p className="text-yellow-700">No jobs found in Firestore database.</p>
              <p className="mt-2">Possible reasons:</p>
              <ul className="list-disc pl-5 mt-2">
                <li>The job wasn't successfully saved to Firestore</li>
                <li>There's an issue with Firestore permissions</li>
                <li>The database connection isn't properly configured</li>
              </ul>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">Company</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Posted At</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job.id}>
                      <td className="px-4 py-2 border">{job.id}</td>
                      <td className="px-4 py-2 border">{job.title}</td>
                      <td className="px-4 py-2 border">{job.company}</td>
                      <td className="px-4 py-2 border">{job.category}</td>
                      <td className="px-4 py-2 border">{job.postedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-8 bg-gray-100 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Raw Data:</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
              {JSON.stringify(jobs, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 