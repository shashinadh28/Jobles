import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/jobs - Get latest jobs
export async function GET(request: Request) {
  try {
    // Parse URL and get search params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    // Set default limit if not provided
    const jobsLimit = limitParam ? parseInt(limitParam) : 10;
    
    // Create query based on filters
    let jobsQuery;
    
    if (category && location) {
      // Filter by both category and location
      jobsQuery = query(
        collection(db, "jobs"),
        where("category", "==", category),
        where("location", "==", location),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else if (category) {
      // Filter by category only
      jobsQuery = query(
        collection(db, "jobs"),
        where("category", "==", category),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else if (location) {
      // Filter by location only
      jobsQuery = query(
        collection(db, "jobs"),
        where("location", "==", location),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else {
      // No filters, just get latest jobs
      jobsQuery = query(
        collection(db, "jobs"),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    }
    
    // Execute query
    const querySnapshot = await getDocs(jobsQuery);
    
    // Process results
    const jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for JSON serialization
        postedAt: data.postedAt?.toDate ? data.postedAt.toDate().toISOString() : new Date().toISOString(),
        deadline: data.deadline?.toDate ? data.deadline.toDate().toISOString() : null
      };
    });
    
    // Return the jobs as JSON
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/jobs - Get latest jobs
export async function GET(request: Request) {
  try {
    // Parse URL and get search params
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    
    // Set default limit if not provided
    const jobsLimit = limitParam ? parseInt(limitParam) : 10;
    
    // Create query based on filters
    let jobsQuery;
    
    if (category && location) {
      // Filter by both category and location
      jobsQuery = query(
        collection(db, "jobs"),
        where("category", "==", category),
        where("location", "==", location),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else if (category) {
      // Filter by category only
      jobsQuery = query(
        collection(db, "jobs"),
        where("category", "==", category),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else if (location) {
      // Filter by location only
      jobsQuery = query(
        collection(db, "jobs"),
        where("location", "==", location),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    } else {
      // No filters, just get latest jobs
      jobsQuery = query(
        collection(db, "jobs"),
        orderBy("postedAt", "desc"),
        limit(jobsLimit)
      );
    }
    
    // Execute query
    const querySnapshot = await getDocs(jobsQuery);
    
    // Process results
    const jobs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for JSON serialization
        postedAt: data.postedAt?.toDate ? data.postedAt.toDate().toISOString() : new Date().toISOString(),
        deadline: data.deadline?.toDate ? data.deadline.toDate().toISOString() : null
      };
    });
    
    // Return the jobs as JSON
    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
} 