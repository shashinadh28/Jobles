const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();

exports.sendJobToTelegram = functions.firestore
    .document('jobs/{jobId}')
    .onCreate(async (snap, context) => {
        const jobId = context.params.jobId;
        const jobData = snap.data();
        
        console.log(`New job created with ID: ${jobId}`, jobData);
        
        // Extract job data with fallbacks
        const {
            title = "Not specified",
            company = "Not specified",
            location = "Not specified",
            qualification = "Not specified",
            experience = "Not specified",
            batch = "Not specified",
            salary = "Not specified",
            websiteLink = "https://jobless.vercel.app/"
        } = jobData;

        // Create message in Markdown format
        const message = `
🚨 *${company} MASS HIRING ${title}*  
📍 *Location:* ${location}  
🎓 *Qualification:* ${qualification}  
👨‍💻 *Experience:* ${experience}  
🏫 *Batch:* ${batch}  
💰 *Salary:* ${salary}  
✅ *Apply Link:* [Click here to Apply](${websiteLink})  
📱 *Join Our WhatsApp:* [WhatsApp Group](https://chat.whatsapp.com/ITlUqvRe99J7lBUPdgZDSo)  
📢 *Join Our Telegram:* [Telegram Channel](https://t.me/joblesswebsite)
        `;

        // Telegram configuration
        const telegramBotToken = '8174082557:AAHN0p4qLOsgAyYuMwXwga0AeT2kmX5vFR8';
        const telegramChatId = '@joblesswebsite'; // Replace with your actual channel name
        
        const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        try {
            console.log('Sending message to Telegram:', message);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: telegramChatId,
                    text: message,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: false
                })
            });

            const data = await response.json();
            
            if (!data.ok) {
                console.error('Error sending message to Telegram:', data);
                return {success: false, error: data};
            } else {
                console.log('Message sent successfully to Telegram:', data);
                return {success: true, messageId: data.result.message_id};
            }
        } catch (error) {
            console.error('Exception while sending message to Telegram:', error);
            return {success: false, error: error.toString()};
        }
    }); 