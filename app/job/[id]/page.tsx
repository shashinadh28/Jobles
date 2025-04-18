"use client";

import { useEffect, useState } from "react";
import { getJobById } from "@/lib/firestore";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Calendar, Building, Clock, Tag, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import EzoicAd from "@/components/ui/EzoicAd";

interface JobData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements?: string;
  salary?: string;
  category?: string;
  experienceLevel?: string;
  batchYear?: string;
  postedAt?: any;
  applyLink?: string;
  [key: string]: any;
}

export default function JobDetails({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchJob() {
      try {
        setLoading(true);
        const jobData = await getJobById(params.id);
        setJob(jobData as JobData);
      } catch (err) {
        console.error("Error fetching job:", err);
        setError("Failed to load job details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="bg-red-50 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
          <p className="text-red-700">{error || "Job not found"}</p>
          <Link href="/latest-jobs" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to job listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/latest-jobs" 
          className="inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to job listings
        </Link>
      </div>
      
      {/* Ezoic Ad Above job details */}
      <div className="my-4">
        <EzoicAd id={105} className="mx-auto max-w-6xl" />
      </div>

      {/* Job details section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
            <Building className="w-4 h-4 mr-1" />
            {job.company}
          </div>
          
          <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location || "Remote"}
          </div>
          
          {job.category && (
            <div className="inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
              <Tag className="w-4 h-4 mr-1" />
              {job.category}
            </div>
          )}
          
          {job.experienceLevel && (
            <div className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm">
              <Briefcase className="w-4 h-4 mr-1" />
              {job.experienceLevel}
            </div>
          )}
          
          {job.postedAt && (
            <div className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {formatDistanceToNow(new Date(job.postedAt.toDate()), { addSuffix: true })}
            </div>
          )}
        </div>
        
        {job.salary && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Compensation</h2>
            <p className="text-gray-800">{job.salary}</p>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Job Description</h2>
          <div className="prose max-w-none text-gray-700" 
               dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br>') }}>
          </div>
        </div>
        
        {job.requirements && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Requirements</h2>
            <div className="prose max-w-none text-gray-700"
                 dangerouslySetInnerHTML={{ __html: job.requirements.replace(/\n/g, '<br>') }}>
            </div>
          </div>
        )}
        
        {job.applyLink && (
          <div className="mt-8">
            <a 
              href={job.applyLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Apply for this position <ArrowUpRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        )}
      </div>
      
      {/* Ezoic Ad Bottom of job details */}
      <div className="my-8">
        <EzoicAd id={106} className="mx-auto max-w-6xl" />
      </div>

      {/* Related jobs section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Similar Jobs</h2>
        
        {/* Ezoic Ad Before similar jobs */}
        <div className="my-4">
          <EzoicAd id={106} className="mx-auto max-w-6xl" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Similar job cards would go here */}
        </div>
      </div>
    </div>
  );
} 