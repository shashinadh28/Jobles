import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export interface Subscriber {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

export async function subscribeToJobAlerts(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Validate email
    if (!email || !email.includes('@')) {
      return { success: false, message: 'Please enter a valid email address' };
    }

    // Check if email already exists
    const subscribersRef = collection(db, "subscribers");
    const q = query(subscribersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return { success: false, message: 'You are already subscribed to job alerts' };
    }

    // Add new subscriber
    await addDoc(subscribersRef, {
      email,
      subscribedAt: serverTimestamp(),
      isActive: true
    });

    return { success: true, message: 'Successfully subscribed to job alerts!' };
  } catch (error) {
    console.error('Error subscribing:', error);
    return { success: false, message: 'Failed to subscribe. Please try again later.' };
  }
} 