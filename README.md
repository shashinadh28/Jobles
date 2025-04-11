# JoBless - Job Portal for Students & Freshers

JoBless is a modern job portal specifically designed for students and fresh graduates to find their dream jobs. The platform provides a user-friendly interface to browse, search, and apply for various job opportunities.

## 🚀 Features

- **Job Listings**: Browse through curated job opportunities
- **Advanced Search**: Filter jobs by:
  - Title
  - Company
  - Location
  - Experience Level
  - Job Type
  - Skills
- **Categories**:
  - Latest Jobs
  - All Jobs
  - Work From Home
  - Internships
  - Fresher Jobs (by batch year)
- **Job Alerts**: Subscribe to get email notifications for new job postings
- **Admin Dashboard**: Easy job posting and management
- **Responsive Design**: Works seamlessly on all devices

## 🛠️ Tech Stack

- **Frontend**:
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Framer Motion
- **Backend**:
  - Firebase
  - Firestore Database
  - Firebase Authentication
  - Firebase Storage
- **Deployment**:
  - Vercel

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/shashinadh28/Jobles.git
cd Jobles
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file and add your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the development server:
```bash
npm run dev
```

## 🔧 Configuration

1. Set up Firebase:
   - Create a Firebase project
   - Enable Firestore Database
   - Set up Authentication
   - Configure Storage

2. Update Firestore Rules:
   - Configure security rules in `firestore.rules`
   - Set up indexes in `firestore.indexes.json`

## 📝 Project Structure

```
jobless/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard pages
│   ├── jobs/              # Job listing pages
│   └── components/        # Reusable components
├── lib/                   # Utility functions
├── public/                # Static assets
└── styles/                # Global styles
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- [Shashinadh](https://github.com/shashinadh28)

## 🙏 Acknowledgments

- Firebase for backend services
- Next.js team for the amazing framework
- All contributors and users of JoBless
