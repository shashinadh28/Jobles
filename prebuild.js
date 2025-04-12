const fs = require('fs');
const path = require('path');

// Ensure directories exist
const ensureDir = (dirPath) => {
  const parts = dirPath.split(path.sep);
  let currentPath = '';
  for (const part of parts) {
    currentPath = path.join(currentPath, part);
    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

// Clean debug page
const debugPage = `"use client";

import React, { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DebugPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const jobsQuery = query(
          collection(db, "jobs"),
          orderBy("postedAt", "desc")
        );
        
        const querySnapshot = await getDocs(jobsQuery);
        
        const jobsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setJobs(jobsList);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs");
        setLoading(false);
      }
    }
    
    fetchJobs();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Jobs Data</h1>
      
      {loading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          <div>Total Jobs: {jobs.length}</div>
          
          {jobs.map(job => (
            <div key={job.id} className="p-4 border rounded-md">
              <div className="font-bold">{job.title}</div>
              <div>{job.company}</div>
              <div>Location: {job.location}</div>
              <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(job, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`;

// Clean auth route
const authRoute = `import { NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const token = await user.getIdToken();
    
    return NextResponse.json({ 
      success: true,
      token,
      user: {
        uid: user.uid,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}`;

// Clean jobs route
const jobsRoute = `import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category');
    
    // Set default limit
    const jobsLimit = limitParam ? parseInt(limitParam) : 10;
    
    // Create query
    let jobsQuery;
    
    if (category && category !== 'all') {
      // Filter by category
      jobsQuery = query(
        collection(db, "jobs"),
        where("category", "==", category),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else {
      // Get latest jobs
      jobsQuery = query(
        collection(db, "jobs"),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    }
    
    // Execute query
    const querySnapshot = await getDocs(jobsQuery);
    
    // Process results
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}`;

// Ensure directories exist
ensureDir('app/jobs/debug');
ensureDir('app/api/auth');
ensureDir('app/api/jobs');

// Delete existing files
try {
  if (fs.existsSync('app/jobs/debug/page.tsx')) {
    fs.unlinkSync('app/jobs/debug/page.tsx');
  }
  if (fs.existsSync('app/api/auth/route.ts')) {
    fs.unlinkSync('app/api/auth/route.ts');
  }
  if (fs.existsSync('app/api/jobs/route.ts')) {
    fs.unlinkSync('app/api/jobs/route.ts');
  }
  console.log('Successfully deleted problematic files');
} catch (error) {
  console.error('Error deleting files:', error);
}

// Write clean files
try {
  fs.writeFileSync('app/jobs/debug/page.tsx', debugPage);
  fs.writeFileSync('app/api/auth/route.ts', authRoute);
  fs.writeFileSync('app/api/jobs/route.ts', jobsRoute);
  console.log('Successfully created clean files');
} catch (error) {
  console.error('Error writing files:', error);
}

console.log('Prebuild script completed'); 