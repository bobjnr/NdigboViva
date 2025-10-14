# Ndigbo Viva Blog

A modern Next.js blog website that integrates with the Ndigbo Viva YouTube channel, featuring automatic blog post generation from YouTube videos, user authentication, email subscriptions, and comprehensive SEO optimization.

## 🚀 Features

### Core Features
- **Homepage** with latest YouTube video and recent blog posts
- **Blog System** with paginated listing and individual post pages
- **YouTube Integration** using YouTube Data API v3
- **User Authentication** with Firebase Auth
- **Email Notifications** via Mailchimp API
- **SEO Optimization** with next-seo and sitemap generation
- **Dark/Light Theme** toggle
- **Responsive Design** (mobile-first)

### Pages
- `/` - Homepage with hero section and latest content
- `/blog` - Paginated blog listing with category filters
- `/blog/[slug]` - Individual blog post with YouTube video embed
- `/about` - Channel story, mission, and team information
- `/contact` - Contact form and information
- `/privacy-policy` - Privacy policy page
- `/terms` - Terms of service page
- `/auth/login` - User login page
- `/auth/register` - User registration page
- `/profile` - User profile and notification settings

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: TailwindCSS
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Email Marketing**: Mailchimp API
- **SEO**: next-seo, next-sitemap
- **Icons**: Lucide React
- **Theme**: next-themes
- **TypeScript**: Full type safety

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ndigbo-viva-blog
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# YouTube API
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
SITE_URL=https://ndigboviva.com
```

## 🚀 Getting Started

1. **Firebase Setup**:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Get your Firebase configuration

2. **YouTube API Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable YouTube Data API v3
   - Create credentials and get your API key
   - Get your YouTube channel ID

3. **Mailchimp Setup**:
   - Create a Mailchimp account
   - Get your API key and server prefix
   - Create an audience and get the list ID

4. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── providers.tsx      # Theme provider
├── components/            # React components
│   └── layout/           # Layout components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── firebase.ts       # Firebase configuration
│   ├── mailchimp.ts      # Mailchimp integration
│   ├── seo.ts           # SEO utilities
│   └── youtube.ts        # YouTube API integration
```

## 🔧 Configuration

### YouTube Channel Integration
The app is configured to work with the Ndigbo Viva YouTube channel: https://www.youtube.com/@NDIGBOVIVA

### Environment Variables
Make sure to set up all required environment variables before running the application. See the installation section for details.

### Firebase Rules
Set up Firestore security rules for user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
npm run build
npm start
```

## 📱 Features in Detail

### YouTube Integration
- Automatically fetches latest videos from the channel
- Creates blog posts from video metadata
- Embeds YouTube videos in blog posts
- Supports video thumbnails and descriptions

### User Authentication
- Email/password registration and login
- User profile management
- Notification preferences
- Secure session management

### Email Marketing
- Newsletter subscription via Mailchimp
- Automated email notifications for new posts
- User preference management
- Campaign creation and management

### SEO Optimization
- Dynamic meta tags for all pages
- Open Graph and Twitter Card support
- JSON-LD structured data
- Automatic sitemap generation
- Robots.txt configuration

### Theme System
- Dark and light mode support
- System preference detection
- Smooth theme transitions
- Persistent theme selection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- YouTube Data API v3 for video integration
- Firebase for authentication and database
- Mailchimp for email marketing
- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework

## 📞 Support

For support, email contact@ndigboviva.com or visit our [contact page](https://ndigboviva.com/contact).

---

**Umuigbo Kunienu!** 🇳🇬