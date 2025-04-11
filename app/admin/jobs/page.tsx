"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Edit, Trash2, Search, Plus, Eye } from "lucide-react";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  postedAt: Date;
  status: "active" | "draft" | "expired";
}

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "expired">("all");

  // Fetch jobs from Firebase (currently using mock data)
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Create a query against the jobs collection
        const jobsQuery = query(
          collection(db, "jobs"),
          orderBy("postedAt", "desc")
        );
        
        // Execute the query
        const querySnapshot = await getDocs(jobsQuery);
        
        // Map the query results to our JobListing interface
        const jobsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "",
            company: data.company || "",
            location: data.location || "",
            category: data.category || "",
            postedAt: data.postedAt?.toDate ? data.postedAt.toDate() : new Date(),
            status: data.status || "active"
          } as JobListing;
        });
        
        setJobs(jobsData);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);

  // Filter jobs based on search query and status filter
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to a readable string
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Handle job deletion (currently just removes from state)
  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      try {
        // Delete the job document from Firestore
        await deleteDoc(doc(db, "jobs", jobId));
        
        // Update the UI by filtering out the deleted job
        setJobs(jobs.filter(job => job.id !== jobId));
      } catch (err) {
        console.error("Error deleting job:", err);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href="/admin" className="inline-flex items-center text-blue-600 hover:underline">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-3xl font-bold mt-4">Manage Job Listings</h1>
          <p className="text-gray-600">View, edit, and delete job listings on your platform.</p>
        </div>

        {/* Filters and search */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search jobs by title, company or location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex-shrink-0">
              <select
                className="w-full md:w-48 py-2 px-4 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            
            <div className="flex-shrink-0">
              <Link 
                href="/admin/submit-job"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-1" />
                Add New Job
              </Link>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </div>
        </div>

        {/* Job listings table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
            <p className="text-gray-500 mb-4">No job listings found matching your filters.</p>
            <Link 
              href="/admin/submit-job"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Your First Job
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${job.category === 'fresher' ? 'bg-green-100 text-green-800' : 
                            job.category === 'internship' ? 'bg-blue-100 text-blue-800' : 
                            job.category === 'wfh' ? 'bg-purple-100 text-purple-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {job.category === 'wfh' ? 'Work From Home' : 
                            job.category.charAt(0).toUpperCase() + job.category.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(job.postedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${job.status === 'active' ? 'bg-green-100 text-green-800' : 
                            job.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/jobs/${job.id}`}
                            className="text-gray-500 hover:text-gray-700" 
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link 
                            href={`/admin/edit-job/${job.id}`}
                            className="text-blue-500 hover:text-blue-700" 
                            title="Edit"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDeleteJob(job.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 