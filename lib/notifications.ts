import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Firestore } from "firebase/firestore";

// Define Job interface locally to avoid dependency issues
interface Job {
  id: string;
  title?: string;
  company?: string;
  location?: string;
  jobType?: string;
  description?: string;
  [key: string]: any;
}

// Wrap SendGrid in a dynamic import that only runs on the server side
let sendgridMail: any = null;

// Function to initialize SendGrid on the server side
async function initSendGrid() {
  if (typeof window === 'undefined' && !sendgridMail) {
    try {
      const sgModule = await import('@sendgrid/mail');
      const sgMail = sgModule.default;
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
      sendgridMail = sgMail;
      return true;
    } catch (error) {
      console.error('Failed to initialize SendGrid:', error);
      return false;
    }
  }
  return !!sendgridMail;
}

// Type for subscriber
interface Subscriber {
  id: string;
  email: string;
  categories?: string[];
  createdAt: any;
}

// Function to notify subscribers about new jobs
export async function notifySubscribers(job: Job): Promise<{ success: boolean; message: string }> {
  try {
    // Initialize SendGrid if not already initialized
    await initSendGrid();
    
    // Check if SendGrid API key is set
    if (!process.env.SENDGRID_API_KEY) {
      return {
        success: false,
        message: "SendGrid API key is not configured"
      };
    }
    
    // Query for active subscribers
    const subscribersQuery = query(
      collection(db as Firestore, "subscribers"),
      where("active", "==", true)
    );
    
    const subscribersSnapshot = await getDocs(subscribersQuery);
    
    if (subscribersSnapshot.empty) {
      console.log("No active subscribers found");
      return {
        success: true,
        message: "No subscribers to notify"
      };
    }
    
    // Extract subscriber emails
    const subscribers: string[] = [];
    subscribersSnapshot.forEach((doc) => {
      const subscriber = doc.data();
      if (subscriber.email) {
        subscribers.push(subscriber.email);
      }
    });
    
    // Only proceed if we have subscribers
    if (subscribers.length === 0) {
      console.log("No valid subscriber emails found");
      return {
        success: true,
        message: "No valid subscriber emails found"
      };
    }
    
    console.log(`Sending email to ${subscribers.length} subscribers`);
    
    // Prepare email message
    const msg = {
      to: subscribers,
      from: 'noreply@jobless.vercel.app', // Replace with your verified sender
      subject: `New Job Alert: ${job.title} at ${job.company}`,
      text: `
        New Job Alert from JoBless!
        
        Title: ${job.title}
        Company: ${job.company}
        Location: ${job.location}
        Job Type: ${job.jobType}
        
        Description:
        ${job.description}
        
        View this job: https://jobless.vercel.app/jobs/${job.id}
        
        To unsubscribe, click here: [Unsubscribe Link]
      `,
      html: `
        <h1>New Job Alert from JoBless!</h1>
        <h2>${job.title}</h2>
        <p><strong>Company:</strong> ${job.company}</p>
        <p><strong>Location:</strong> ${job.location}</p>
        <p><strong>Job Type:</strong> ${job.jobType}</p>
        <h3>Description:</h3>
        <p>${job.description}</p>
        <p><a href="https://jobless.vercel.app/jobs/${job.id}">View this job</a></p>
        <p><small>To unsubscribe, <a href="#">click here</a></small></p>
      `
    };

    // Send the email
    await sendgridMail.send(msg);
    console.log("Notifications sent successfully to:", subscribers);

    return {
      success: true,
      message: `Notifications sent to ${subscribers.length} subscribers`
    };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 