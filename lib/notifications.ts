import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import sgMail from '@sendgrid/mail';

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function notifySubscribers(jobData: any) {
  try {
    // Get all active subscribers
    const subscribersRef = collection(db, "subscribers");
    const q = query(subscribersRef, where("isActive", "==", true));
    const querySnapshot = await getDocs(q);

    const subscribers = querySnapshot.docs.map(doc => doc.data().email);

    if (subscribers.length === 0) {
      console.log("No active subscribers to notify");
      return { success: true, message: "No subscribers to notify" };
    }

    // Prepare email content
    const msg = {
      to: subscribers,
      from: 'noreply@jobless.vercel.app', // Replace with your verified sender
      subject: `New Job Alert: ${jobData.title} at ${jobData.company}`,
      text: `
        New Job Alert from JoBless!
        
        Title: ${jobData.title}
        Company: ${jobData.company}
        Location: ${jobData.location}
        Job Type: ${jobData.jobType}
        
        Description:
        ${jobData.description}
        
        View this job: https://jobless.vercel.app/jobs/${jobData.id}
        
        To unsubscribe, click here: [Unsubscribe Link]
      `,
      html: `
        <h1>New Job Alert from JoBless!</h1>
        <h2>${jobData.title}</h2>
        <p><strong>Company:</strong> ${jobData.company}</p>
        <p><strong>Location:</strong> ${jobData.location}</p>
        <p><strong>Job Type:</strong> ${jobData.jobType}</p>
        <h3>Description:</h3>
        <p>${jobData.description}</p>
        <p><a href="https://jobless.vercel.app/jobs/${jobData.id}">View this job</a></p>
        <p><small>To unsubscribe, <a href="#">click here</a></small></p>
      `
    };

    // Send the email
    await sgMail.send(msg);
    console.log("Notifications sent successfully to:", subscribers);

    return { success: true, message: "Notifications sent successfully" };
  } catch (error) {
    console.error("Error sending notifications:", error);
    return { success: false, message: "Failed to send notifications" };
  }
} 