"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  postedAt: any;
}

export default function DeleteJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = useState(true);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsCollection = collection(db, "jobs");
        const jobsSnapshot = await getDocs(jobsCollection);
        
        const jobsList = jobsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "No Title",
            company: data.company || "No Company",
            category: data.category || "No Category",
            postedAt: data.postedAt
          };
        });
        
        // Sort by date (newest first)
        jobsList.sort((a, b) => {
          const dateA = a.postedAt?.toDate ? a.postedAt.toDate() : new Date();
          const dateB = b.postedAt?.toDate ? b.postedAt.toDate() : new Date();
          return dateB.getTime() - dateA.getTime();
        });
        
        setJobs(jobsList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const deleteJob = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteDoc(doc(db, "jobs", id));
      setDeletedIds([...deletedIds, id]);
      console.log(`Job ${id} deleted successfully`);
    } catch (err) {
      console.error(`Error deleting job ${id}:`, err);
      setError(`Failed to delete job. Error: ${err}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    // Don't show deleted jobs if showDeleted is false
    if (!showDeleted && deletedIds.includes(job.id)) {
      return false;
    }
    
    // Apply text filter if provided
    if (filter && !job.title.toLowerCase().includes(filter.toLowerCase()) && 
        !job.company.toLowerCase().includes(filter.toLowerCase()) && 
        !job.id.toLowerCase().includes(filter.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const testJobs = filteredJobs.filter(job => 
    job.title.includes("Test") || 
    job.company.includes("Test") || 
    job.title.includes("TODAY") || 
    job.title.includes("Current Date")
  );

  const regularJobs = filteredJobs.filter(job => 
    !(job.title.includes("Test") || 
      job.company.includes("Test") || 
      job.title.includes("TODAY") || 
      job.title.includes("Current Date"))
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Delete Jobs</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Filter by title, company or ID..."
            className="w-full p-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showDeleted"
            checked={showDeleted}
            onChange={() => setShowDeleted(!showDeleted)}
            className="mr-2"
          />
          <label htmlFor="showDeleted">Show deleted jobs</label>
        </div>
        
        <Link 
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {testJobs.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-red-600">Test Jobs ({testJobs.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Posted At</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testJobs.map(job => (
                      <tr 
                        key={job.id} 
                        className={`border-t ${
                          deletedIds.includes(job.id) ? 'bg-red-50 line-through text-gray-500' : ''
                        }`}
                      >
                        <td className="px-4 py-2 font-mono text-xs">{job.id}</td>
                        <td className="px-4 py-2">{job.title}</td>
                        <td className="px-4 py-2">{job.company}</td>
                        <td className="px-4 py-2">{job.category}</td>
                        <td className="px-4 py-2">
                          {job.postedAt?.toDate ? 
                            job.postedAt.toDate().toLocaleString() : 'Unknown'}
                        </td>
                        <td className="px-4 py-2">
                          {deletedIds.includes(job.id) ? (
                            <span className="text-red-500">Deleted</span>
                          ) : (
                            <button
                              onClick={() => deleteJob(job.id)}
                              disabled={deletingId === job.id}
                              className={`px-3 py-1 rounded text-white ${
                                deletingId === job.id
                                  ? 'bg-gray-400'
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                              {deletingId === job.id ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {regularJobs.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Regular Jobs ({regularJobs.length})</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Company</th>
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Posted At</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularJobs.map(job => (
                      <tr 
                        key={job.id} 
                        className={`border-t ${
                          deletedIds.includes(job.id) ? 'bg-red-50 line-through text-gray-500' : ''
                        }`}
                      >
                        <td className="px-4 py-2 font-mono text-xs">{job.id}</td>
                        <td className="px-4 py-2">{job.title}</td>
                        <td className="px-4 py-2">{job.company}</td>
                        <td className="px-4 py-2">{job.category}</td>
                        <td className="px-4 py-2">
                          {job.postedAt?.toDate ? 
                            job.postedAt.toDate().toLocaleString() : 'Unknown'}
                        </td>
                        <td className="px-4 py-2">
                          {deletedIds.includes(job.id) ? (
                            <span className="text-red-500">Deleted</span>
                          ) : (
                            <button
                              onClick={() => deleteJob(job.id)}
                              disabled={deletingId === job.id}
                              className={`px-3 py-1 rounded text-white ${
                                deletingId === job.id
                                  ? 'bg-gray-400'
                                  : 'bg-red-600 hover:bg-red-700'
                              }`}
                            >
                              {deletingId === job.id ? 'Deleting...' : 'Delete'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-gray-500">No jobs found</p>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <h3 className="font-semibold text-lg mb-2">⚠️ Warning</h3>
        <p>Deleting jobs is permanent and cannot be undone. Make sure you only delete the jobs you no longer want.</p>
      </div>
    </div>
  );
} 