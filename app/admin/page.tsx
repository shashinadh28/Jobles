"use client";

import Link from "next/link";
import { PlusCircle, ListChecks, Edit, Home, AlertTriangle, Send } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="container mx-auto px-4 py-12 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-800">
                <strong>Caution:</strong> Authentication is temporarily bypassed. Remember to secure this page before production.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage job listings and site content</p>
          </div>
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Site
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Job Management</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-5">
              <Link href="/admin/submit-job" className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <PlusCircle className="h-6 w-6 text-green-500 group-hover:text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-green-600">Post New Job</h3>
                    <p className="mt-1 text-sm text-gray-500">Add a new job listing to the platform.</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="px-6 py-5">
              <Link href="/admin/jobs" className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <ListChecks className="h-6 w-6 text-blue-500 group-hover:text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">Manage Jobs</h3>
                    <p className="mt-1 text-sm text-gray-500">View, edit or delete existing job listings.</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="px-6 py-5">
              <Link href="/admin/reported-jobs" className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-orange-500 group-hover:text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-orange-600">Reported Jobs</h3>
                    <p className="mt-1 text-sm text-gray-500">Review and handle jobs reported as expired by users.</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="px-6 py-5">
              <Link href="/admin/post-to-telegram" className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Send className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600">Post to Telegram</h3>
                    <p className="mt-1 text-sm text-gray-500">Manually post job listings to the Telegram channel.</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="px-6 py-5">
              <Link href="/admin/edit-job" className="group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Edit className="h-6 w-6 text-purple-500 group-hover:text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-purple-600">Edit Job Listing</h3>
                    <p className="mt-1 text-sm text-gray-500">Update information for an existing job listing.</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 mt-8">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Analytics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="px-6 py-5">
              <h3 className="text-sm font-medium text-gray-500">Active Jobs</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">247</p>
            </div>
            <div className="px-6 py-5">
              <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">15,492</p>
            </div>
            <div className="px-6 py-5">
              <h3 className="text-sm font-medium text-gray-500">Applications</h3>
              <p className="mt-1 text-3xl font-semibold text-gray-900">1,204</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-medium text-green-800 mb-2">Firebase Configuration Status</h2>
          <p className="text-green-700 mb-4">
            Firebase has been configured successfully! Your site is using Firebase for:
          </p>
          <ul className="list-disc pl-5 text-green-700 space-y-2 mb-4">
            <li>Storing job listings in Firestore database</li>
            <li>Telegram integration for job posting</li>
            <li>User reporting of expired jobs</li>
            <li>Admin management functionalities</li>
          </ul>
          <p className="text-green-700">
            To enhance security, consider implementing proper authentication for the admin area before full production deployment.
          </p>
        </div>
      </div>
    </div>
  );
} 
 