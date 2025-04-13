# JoBless Telegram Job Posting Function

This Firebase Cloud Function automatically posts new job listings from the Firestore database to a Telegram channel.

## Setup Instructions

### Prerequisites
- Firebase project with Firestore database
- Telegram bot (with admin privileges in your channel)

### Installation

1. **Install Firebase CLI (if you haven't already)**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Install dependencies**
   ```bash
   cd functions
   npm install
   ```

4. **Configure the function**
   Open `index.js` and update the following constants:
   - `BOT_TOKEN`: Your Telegram bot token
   - `CHANNEL_ID`: Your Telegram channel ID or username (with @ prefix)

### Telegram Bot Setup

1. **Create a Telegram Bot**
   - Start a chat with [@BotFather](https://t.me/BotFather) on Telegram
   - Send `/newbot` and follow the instructions
   - Note the HTTP API token provided (this is your BOT_TOKEN)

2. **Add your bot to your channel as an admin**
   - Open your channel settings
   - Go to Administrators
   - Add Administrator
   - Search for your bot by username
   - Enable "Post Messages" permission

### Deployment

Deploy the function to Firebase:
```bash
firebase deploy --only functions
```

## Usage

Once deployed, the function will automatically trigger whenever a new job document is added to the `jobs` collection in Firestore.

### Manual Triggering

You can also manually trigger the function to post a specific job:

```javascript
// From your admin panel or any authenticated Firebase client
const functions = firebase.functions();
const manualPostJob = functions.httpsCallable('manualPostJobToTelegram');
manualPostJob({ jobId: 'your-job-id' })
  .then((result) => {
    console.log('Job posting result:', result.data);
  })
  .catch((error) => {
    console.error('Error posting job:', error);
  });
```

## Function Behavior

1. When a new job is added to Firestore, the function formats the job data into a readable message
2. The message is posted to the Telegram channel using the bot
3. The Firestore document is updated with `telegramPosted: true` and the message ID
4. If an error occurs, it's logged and stored in the job document

## Troubleshooting

If the function fails to post to Telegram:

1. Check that your bot has admin privileges in the channel
2. Verify that the channel ID/username is correct
3. Make sure the bot token is valid
4. Check the Firebase function logs for specific error messages
   ```bash
   firebase functions:log
   ```

## Function Structure

- `postJobToTelegram`: The main function that triggers on new job document creation
- `manualPostJobToTelegram`: An HTTP callable function to manually post a job

## Fields Added to Job Documents

After posting to Telegram, the function adds these fields to the job document:

- `telegramPosted`: Boolean indicating whether the job was posted
- `telegramPostTime`: Timestamp of when the job was posted
- `telegramMessageId`: ID of the Telegram message (useful for updates)
- `telegramPostError`: Error message (if any)
- `telegramPostErrorTime`: Timestamp of when the error occurred 