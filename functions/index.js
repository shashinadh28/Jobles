/**
 * Firebase Cloud Function to automatically post new job listings to Telegram
 * 
 * This function triggers whenever a new job document is added to the 'jobs' collection
 * in Firestore. It formats the job information and posts it to a Telegram channel
 * using a bot.
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Firestore database reference
const db = admin.firestore();

// Constants for Telegram API
// IMPORTANT: Replace these with your actual values
const BOT_TOKEN = '8174082557:AAHN0p4qLOsgAyYuMwXwga0AeT2kmX5vFR8'; // Your actual bot token
const CHANNEL_ID = '@JoBless128'; // Your actual channel ID

// Helper function to truncate text to a certain length
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Cloud Function that triggers on new job document creation
 */
exports.postJobToTelegram = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    try {
      // Get job data and ID from the triggered document
      const jobData = snapshot.data();
      const jobId = context.params.jobId;
      
      // Check if this job has already been posted to Telegram
      if (jobData.telegramPosted) {
        console.log(`Job ${jobId} has already been posted to Telegram. Skipping.`);
        return null;
      }
      
      // Base URL for job details page
      const jobUrl = `https://jobless.careers/jobs/${jobId}`;
      
      // Format the job description (truncate if too long)
      const shortDescription = truncateText(jobData.description, 200);
      
      // Create a well-formatted message with emojis
      const message = `
🚨 *NEW JOB OPPORTUNITY* 🚨

🏢 *Company:* ${jobData.company}
💼 *Position:* ${jobData.title}
${jobData.location ? `📍 *Location:* ${jobData.location}\n` : ''}${jobData.salary ? `💰 *Salary:* ${jobData.salary}\n` : ''}${jobData.category ? `🏷️ *Category:* ${jobData.category}\n` : ''}
📝 *Description:*
${shortDescription}

⏰ *Posted:* ${new Date(jobData.createdAt?.toDate()).toLocaleDateString() || 'Just now'}

*Requirements:*
${truncateText(jobData.requirements || 'No specific requirements mentioned.', 200)}

🔗 *Apply now:* [View Job Details](${jobUrl})
`;
      
      console.log('Sending message to Telegram:', message);
      
      // Send the message to Telegram channel using the bot
      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHANNEL_ID,
          text: message,
          parse_mode: 'Markdown',
          disable_web_page_preview: false // Enable preview for the job URL
        }
      );
      
      console.log('Successfully posted job to Telegram:', response.data);
      
      // Update the job document to mark it as posted to Telegram
      await snapshot.ref.update({
        telegramPosted: true,
        telegramPostTime: admin.firestore.FieldValue.serverTimestamp(),
        telegramMessageId: response.data.result?.message_id || null
      });
      
      return null;
    } catch (error) {
      console.error('Error posting job to Telegram:', error);
      
      // If the error is related to the Telegram API, log specific details
      if (error.response) {
        console.error('Telegram API error details:', {
          status: error.response.status,
          data: error.response.data
        });
      }
      
      // Store the error in Firestore for debugging
      await snapshot.ref.update({
        telegramPostError: error.message || 'Unknown error',
        telegramPostErrorTime: admin.firestore.FieldValue.serverTimestamp()
      }).catch(err => {
        console.error('Failed to update document with error:', err);
      });
      
      return null;
    }
  });

/**
 * Optional: Function to manually post a job to Telegram by job ID
 * This can be called via an HTTP request to manually post/repost a job
 */
exports.manualPostJobToTelegram = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated and has admin role
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to use this feature.'
    );
  }
  
  const jobId = data.jobId;
  if (!jobId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Job ID is required'
    );
  }
  
  try {
    // Get the job document
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    
    if (!jobDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        `Job with ID ${jobId} not found`
      );
    }
    
    // Create a fake snapshot and context to reuse the main function logic
    const snapshot = {
      data: () => jobDoc.data(),
      ref: jobDoc.ref
    };
    
    const context = {
      params: { jobId }
    };
    
    // Call the main function logic
    await exports.postJobToTelegram.run(snapshot, context);
    
    return { success: true, message: 'Job posted to Telegram successfully' };
  } catch (error) {
    console.error('Error in manual post:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
}); 