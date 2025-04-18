"use client";

import { Job } from "@/lib/firestore";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Tag, GraduationCap, Clock, Calendar, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface JobCardProps {
  job: Job;
  compact?: boolean;
  onClick?: () => void;
}

export function JobCard({ job, compact, onClick }: JobCardProps) {
  // Format the date to a readable string
  const formattedDate = job.postedAt instanceof Date 
    ? `${Math.ceil(Math.abs(new Date().getTime() - job.postedAt.getTime()) / (1000 * 60 * 60 * 24))} days ago`
    : 'Recently';

  // Function to determine if a URL is a data URL
  const isDataUrl = (url?: string) => url?.startsWith('data:');
  
  // Function to determine if a URL is a remote URL
  const isRemoteUrl = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://');
  };
  
  // State to track image loading errors
  const [imageError, setImageError] = useState(false);

  // Limit description to 120 characters
  const limitedDescription = job.description && job.description.length > 120 
    ? `${job.description.substring(0, 120)}...` 
    : job.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`group relative flex cursor-pointer flex-col rounded-2xl border p-5 transition-all 
      ${compact 
        ? 'border-gray-200 bg-white hover:shadow-md'
        : 'border-gray-200 bg-white shadow-md hover:border-blue-100 hover:shadow-lg'
      }`}
      onClick={onClick}
    >
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            {job.title}
          </h3>
          <div className="text-lg font-medium text-neutral-700 mb-2">
            {job.company}
          </div>
        </div>
        {job.logoUrl && !imageError && (
          <div className="h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
            {isDataUrl(job.logoUrl) ? (
              <img
                src={job.logoUrl}
                alt={`${job.company} logo`}
                className="h-full w-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : isRemoteUrl(job.logoUrl) ? (
              <div className="relative h-24 w-24">
                <Image
                  src={job.logoUrl}
                  alt={`${job.company} logo`}
                  width={96}
                  height={96}
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100">
                <span className="text-lg font-bold text-gray-500">{job.company?.substring(0, 2)}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-4 space-y-2">
        <div className="flex items-center text-sm text-neutral-600">
          <MapPin className="mr-2 h-4 w-4" />
          {job.location}
        </div>
        
        <div className="flex items-center text-sm text-neutral-600">
          <Briefcase className="mr-2 h-4 w-4" />
          {job.jobType}
        </div>
        
        {job.experienceLevel && (
          <div className="flex items-center text-sm text-neutral-600">
            <Tag className="mr-2 h-4 w-4" />
            {job.experienceLevel}
          </div>
        )}
        
        {job.batchYear && (
          <div className="flex items-center text-sm text-neutral-600">
            <GraduationCap className="mr-2 h-4 w-4" />
            {job.batchYear} Batch
          </div>
        )}
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          {job.jobType}
        </span>
        
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
          {job.location}
        </span>
        
        {job.category && (
          <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
            {job.category}
          </span>
        )}
        
        {job.experienceLevel && (
          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
            {job.experienceLevel}
          </span>
        )}
      </div>
      
      {/* Skills section */}
      {job.skills && job.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-neutral-700">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span 
                key={index}
                className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="inline-flex rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
      
      {job.salary && (
        <div className="mb-4 text-sm font-medium text-green-600">
          {job.salary}
        </div>
      )}
      
      <p className="mb-6 line-clamp-3 text-sm text-neutral-600">
        {limitedDescription}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-neutral-500">
          <Calendar className="mr-1 h-3 w-3" />
          Posted {formattedDate}
        </div>
        
        <div className="flex gap-3">
          <Link
            href={`/jobs/${job.id}`}
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
          >
            <span>Read More</span>
          </Link>
          
          {job.applicationLink && (
            <a 
              href={job.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
} 