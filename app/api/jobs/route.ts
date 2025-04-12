import { NextResponse } from 'next/server';
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
}
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
}