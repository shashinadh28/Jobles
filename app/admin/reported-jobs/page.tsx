'use client';

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Trash2, CheckCircle, AlertCircle, Calendar, Building, Briefcase } from "lucide-react";
import Link from "next/link";

interface JobReport {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'deleted';
  reportedAt: any; // Firebase timestamp
  reviewedAt: any; // Firebase timestamp
  reviewedBy: string | null;
  actionTaken: string | null;
}

export default function ReportedJobsPage() {
  const [reports, setReports] = useState<JobReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    fetchReports();
  }, []);
  
  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportsQuery = query(
        collection(db, 'expiredJobReports'),
        orderBy('reportedAt', 'desc')
      );
      
      const snapshot = await getDocs(reportsQuery);
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as JobReport[];
      
      setReports(reportsData);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reported jobs');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  const markAsReviewed = async (reportId: string) => {
    if (processingIds.has(reportId)) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(reportId));
      
      await updateDoc(doc(db, 'expiredJobReports', reportId), {
        status: 'reviewed',
        reviewedAt: new Date(),
        reviewedBy: 'Admin', // Ideally, use actual user ID/name
        actionTaken: 'Marked as reviewed (no action needed)',
      });
      
      setReports(reports.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'reviewed', 
              reviewedAt: new Date(),
              reviewedBy: 'Admin',
              actionTaken: 'Marked as reviewed (no action needed)'
            } 
          : report
      ));
      
    } catch (err) {
      console.error('Error updating report:', err);
      alert('Failed to update the report status');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };
  
  const deleteJob = async (reportId: string, jobId: string) => {
    if (processingIds.has(reportId)) return;
    
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }
    
    try {
      setProcessingIds(prev => new Set(prev).add(reportId));
      
      // Check if job exists
      const jobDoc = await getDoc(doc(db, 'jobs', jobId));
      
      if (jobDoc.exists()) {
        // Delete the job
        await deleteDoc(doc(db, 'jobs', jobId));
      }
      
      // Update the report
      await updateDoc(doc(db, 'expiredJobReports', reportId), {
        status: 'deleted',
        reviewedAt: new Date(),
        reviewedBy: 'Admin', // Ideally, use actual user ID/name
        actionTaken: 'Job deleted',
      });
      
      setReports(reports.map(report => 
        report.id === reportId 
          ? { 
              ...report, 
              status: 'deleted', 
              reviewedAt: new Date(),
              reviewedBy: 'Admin',
              actionTaken: 'Job deleted'
            } 
          : report
      ));
      
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete the job');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-red-50 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">
            {error}
          </h1>
          <p className="mb-6 text-red-600">
            There was an error loading the reported jobs. Please try again later.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Reported Jobs</h1>
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
          >
            Back to Admin
          </Link>
        </div>
        
        {reports.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-600">No job reports found. All clear!</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reported At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reviewed At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {report.jobTitle}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {report.company}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              ID: {report.jobId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(report.reportedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          report.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : report.status === 'reviewed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.reviewedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          {report.status === 'pending' && (
                            <>
                              <Link 
                                href={`/jobs/${report.jobId}`}
                                target="_blank"
                                className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => markAsReviewed(report.id)}
                                disabled={processingIds.has(report.id)}
                                className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 flex items-center"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Keep
                              </button>
                              <button
                                onClick={() => deleteJob(report.id, report.jobId)}
                                disabled={processingIds.has(report.id)}
                                className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 flex items-center"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete Job
                              </button>
                            </>
                          )}
                          {report.status !== 'pending' && (
                            <div className="text-gray-500 italic">
                              {report.actionTaken || 'No action recorded'}
                            </div>
                          )}
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