import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    console.log("Received report expired job request");
    
    // Parse the request body
    const body = await request.json();
    const { jobId, jobTitle, company } = body;
    
    console.log("Report data:", { jobId, jobTitle, company });
    
    // Validate required fields
    if (!jobId) {
      console.error("Job ID is required but was not provided");
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }
    
    // Check if db is properly initialized
    if (!db) {
      console.error("Firestore db object is not properly initialized");
      return NextResponse.json({ 
        error: 'Database connection error. Please try again later.' 
      }, { status: 500 });
    }
    
    // Create a new document in the 'expiredJobReports' collection
    const reportData = {
      jobId,
      jobTitle: jobTitle || 'Unknown',
      company: company || 'Unknown',
      status: 'pending', // pending, reviewed, deleted
      reportedAt: serverTimestamp(),
      reviewedAt: null,
      reviewedBy: null,
      actionTaken: null,
    };
    
    console.log("Attempting to save report to Firestore:", reportData);
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'expiredJobReports'), reportData);
    
    console.log('Job report submitted successfully:', docRef.id);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: docRef.id
    });
    
  } catch (error: any) {
    // Detailed error logging
    console.error("Error submitting job report:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to submit report. Please try again later.' },
      { status: 500 }
    );
  }
} 