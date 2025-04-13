const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Firebase Cloud Function that sends a notification to a Telegram channel
 * whenever a new job is added to the Firestore database.
 */
exports.sendNewJobToTelegram = functions.firestore
  .document('jobs/{jobId}')
  .onCreate(async (snapshot, context) => {
    try {
      // Get the job data from the new document
      const jobData = snapshot.data();
      const jobId = context.params.jobId;
      
      functions.logger.info("New job added to Firestore", {
        jobId: jobId,
        title: jobData.title,
        company: jobData.company
      });
      
      // Bot configuration
      const botToken = "8174082557:AAHN0p4qLOsgAyYuMwXwga0AeT2kmX5vFR8";
      const chatId = "@JoBless128";
      
      // Default values for missing fields
      const title = jobData.title || "Not specified";
      const company = jobData.company || "Not specified";
      const location = jobData.location || "Not specified";
      const qualification = jobData.qualification || "Not specified";
      const experience = jobData.experienceLevel || "Not specified";
      const batch = jobData.batchYear || "Not specified";
      const salary = jobData.salary || "Not specified";
      const websiteLink = jobData.applicationLink || `https://jobless.careers/jobs/${jobId}`;
      
      // Links for WhatsApp and Telegram
      const whatsappLink = "https://chat.whatsapp.com/CX1ATQLF3D1Fc4XJgJOsL1";
      const telegramLink = "https://t.me/JoBless128";
      
      // Format message using Markdown
      const message = `🚨 *${company.toUpperCase()} MASS HIRING ${title.toUpperCase()}*\n\n` +
                      `📍 *Location:* ${location}\n` +
                      `🎓 *Qualification:* ${qualification}\n` +
                      `👨‍💻 *Experience:* ${experience}\n` +
                      `🏫 *Batch:* ${batch}\n` +
                      `💰 *Salary:* ${salary}\n\n` +
                      `✅ *Apply Link:* [Click here to Apply](${websiteLink})\n` +
                      `📱 *Join Our WhatsApp:* [WhatsApp Link](${whatsappLink})\n` +
                      `📢 *Join Our Telegram:* [Telegram Channel Link](${telegramLink})`;
      
      functions.logger.info("Sending message to Telegram", {
        chatId: chatId,
        messagePreview: message.substring(0, 100) + "..." 
      });
      
      // Send the message to Telegram
      const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await axios.post(telegramUrl, {
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: false
      });
      
      // Log success
      functions.logger.info("Job post sent to Telegram successfully", {
        jobId: jobId,
        telegramResponse: response.data,
        jobTitle: title,
        company: company
      });
      
      return { success: true, message: "Job post sent to Telegram successfully" };
    } catch (error) {
      // Log error
      functions.logger.error("Error sending job post to Telegram", {
        error: error.message,
        stack: error.stack
      });
      
      return { success: false, error: error.message };
    }
  }); 