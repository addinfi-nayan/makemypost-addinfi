# Social Media Automation Platform

A modern Next.js application for automated social media content creation and scheduling with real-time OAuth integration for Instagram, Facebook, and LinkedIn.

## 🚀 Features

- **Real-time Social Media Integration**: OAuth 2.0 authentication for Instagram, Facebook, LinkedIn
- **AI-Powered Content Generation**: Automated post creation with customizable themes
- **Smart Scheduling**: Calendar-based post scheduling with timezone support
- **Brand Management**: Logo upload, brand settings, and profile customization
- **Credit System**: Usage-based billing with top-up and subscription plans
- **Responsive Design**: Modern dark theme with glass-morphism effects
- **Secure Token Storage**: Encrypted storage of social media access tokens

## 🛠 Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel (recommended)

## 📱 Supported Platforms

- **Instagram**: Basic profile, media access, content publishing
- **Facebook**: Page management, posting, insights tracking
- **LinkedIn**: Professional profile, content posting, company pages

## 🏗 Project Structure

```
├── app/                    # Next.js app router
│   ├── dashboard/         # Dashboard pages
│   │   ├── create/      # Content creation
│   │   ├── social/       # Social connections
│   │   ├── settings/     # Brand settings
│   │   ├── billing/      # Credit management
│   │   └── schedule/    # Post scheduling
│   ├── api/              # API routes
│   │   └── oauth/        # OAuth handlers
│   └── globals.css        # Global styles
├── components/             # Reusable components
│   └── Navbar.tsx         # Navigation component
├── lib/                   # Utility libraries
│   ├── social-auth.ts      # OAuth integration
│   ├── encryption.ts       # Token encryption
│   ├── actions.ts         # Database actions
│   └── supabase.ts       # Database client
└── public/                # Static assets
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase project

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/makemypost-addinfi.git
cd makemypost-addinfi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Social Media OAuth
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🗄 Database Setup

Run the provided SQL schema in your Supabase dashboard to set up:
- Users and profiles
- Social tokens storage
- Scheduled posts
- Credits system

## 🔧 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build and export static files
npm run build

# Deploy to your preferred hosting
```

## 🔐 Security Features

- **OAuth 2.0**: Secure authentication flow
- **Token Encryption**: Encrypted storage of access tokens
- **State Validation**: CSRF protection
- **Row Level Security**: Database access control
- **Environment Variables**: Secure credential management

## 📊 Monitoring & Analytics

- **Error Tracking**: Comprehensive error logging
- **Performance**: Optimized loading and caching
- **User Analytics**: Usage tracking and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [Setup Guide](./SOCIAL_SETUP_GUIDE.md)
- Review the documentation

---

Built with ❤️ using Next.js, Tailwind CSS, and Supabase
