'use client';

import React from 'react';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <h1 className="text-4xl font-bold text-center mb-8">About JoBless</h1>
        
        {/* Vision Section */}
        <div className="bg-blue-50 rounded-xl p-8 mb-12 shadow-md">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Our Vision</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            JoBless started with a vision to provide latest placement updates for students & fresher graduates. 
            We connect talent with opportunity and help you find your dream job.
          </p>
        </div>
        
        {/* Mission and Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To bridge the gap between talented job seekers and quality opportunities by providing timely, 
              relevant job updates and resources that empower candidates to succeed in their career journey.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Do</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide daily updates on latest job opportunities</li>
              <li>Focus on fresher-friendly positions</li>
              <li>Curate remote and work-from-home opportunities</li>
              <li>Highlight quality internships for students</li>
              <li>Verify job listings for authenticity</li>
            </ul>
          </div>
        </div>
        
        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-xl p-8 mb-12 shadow-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Why Choose JoBless?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Daily Updates</h3>
              <p className="text-gray-600">Fresh job listings posted every day</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Verified Listings</h3>
              <p className="text-gray-600">All jobs are manually verified</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Fresher Focused</h3>
              <p className="text-gray-600">Specially curated for new graduates</p>
            </div>
          </div>
        </div>
        
        {/* Commitment Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <p className="text-lg text-gray-700 italic">
            "We are committed to helping every job seeker find their dream role by providing quality opportunities and timely updates."
          </p>
        </div>
      </div>
    </div>
  );
} 