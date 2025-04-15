import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { jobId, jobTitle, company } = body;
    
    // Validate required fields
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
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
    
    // Save to Firestore
    const docRef = await addDoc(collection(db, 'expiredJobReports'), reportData);
    
    console.log('Job report submitted successfully:', docRef.id);
    
    // Return success response
    return NextResponse.json({ 
      success: true, 
      message: 'Report submitted successfully',
      reportId: docRef.id
    });
    
  } catch (error) {
    console.error('Error submitting job report:', error);
    
    // Return error response
    return NextResponse.json(
      { error: 'Failed to submit report. Please try again later.' },
      { status: 500 }
    );
  }
} 