# Real-Time Social Media Integration Setup Guide

## Overview
This guide helps you set up real-time connections for Instagram, Facebook, and LinkedIn using OAuth 2.0.

## Prerequisites
- Node.js 18+ installed
- Supabase project set up
- Developer accounts on each platform

## 1. Platform Developer Setup

### Instagram (Meta)
1. Go to [Meta Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Instagram Basic Display" product
4. Configure OAuth redirect URI: `https://yourdomain.com/api/oauth/callback`
5. Get Client ID and Client Secret

### Facebook
1. Use the same Meta app as Instagram
2. Add "Facebook Login" product
3. Configure permissions: `pages_manage_posts`, `pages_read_engagement`
4. Use same redirect URI as Instagram

### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps/new)
2. Create new app
3. Add "Sign In with LinkedIn" product
4. Configure redirect URI: `https://yourdomain.com/api/oauth/callback`
5. Request permissions: `r_liteprofile`, `w_member_social`
6. Get Client ID and Client Secret

## 2. Environment Variables

Create `.env.local` file:

```env
# Instagram (Meta) OAuth
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret

# Facebook (Meta) OAuth  
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 3. Database Schema

Add these tables to your Supabase database:

```sql
-- Social tokens storage
CREATE TABLE social_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  user_profile JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE social_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can manage their own social tokens"
  ON social_tokens
  FOR ALL
  USING (auth.uid() = user_id);
```

## 4. Features Implemented

### OAuth Flow
- Secure state parameter generation
- Token exchange and storage
- Profile fetching
- Token verification

### Platform Support
- **Instagram**: Basic profile, media access, content publishing
- **Facebook**: Page management, posting, insights
- **LinkedIn**: Profile access, content posting, company pages

### Security Features
- Encrypted token storage
- State parameter validation
- Token refresh capability
- Row-level security

## 5. Usage

1. User clicks "Connect" on any platform
2. Redirected to platform's OAuth page
3. User authorizes the application
4. Redirected back with authorization code
5. Code exchanged for access token
6. Token stored securely in database
7. Platform shows as "Connected"

## 6. Testing

### Local Development
```bash
# Start the development server
npm run dev

# Test OAuth flow
# Navigate to /dashboard/social
# Click "Connect" on any platform
```

### Production Deployment
- Update `NEXT_PUBLIC_APP_URL` to production domain
- Add production redirect URIs to each platform's app settings
- Ensure HTTPS is enabled (required for OAuth)

## 7. Troubleshooting

### Common Issues
1. **Redirect URI mismatch**: Ensure exact URI matches platform settings
2. **Missing scopes**: Check platform permissions
3. **Token expired**: Implement refresh token logic
4. **CORS issues**: Verify API endpoint configuration

### Debug Mode
Add to `.env.local`:
```env
DEBUG=true
```

## 8. Next Steps

- Implement post scheduling using stored tokens
- Add webhook support for real-time updates
- Create analytics dashboard
- Add multi-account support per platform

## Security Notes

- Never commit `.env.local` to version control
- Use HTTPS in production
- Implement rate limiting
- Regular token rotation
- Monitor for suspicious activity
