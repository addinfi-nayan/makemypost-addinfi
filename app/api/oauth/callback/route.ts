import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getUserProfile, verifyOAuthState } from '@/lib/social-auth';
import { saveSocialToken } from '@/lib/encryption';
import { createBrowserClient } from '@/lib/supabase';

/**
 * OAuth Callback Handler
 * Handles callbacks from Instagram, Facebook, LinkedIn
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=${encodeURIComponent(error)}`
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=missing_params`
    );
  }

  try {
    // Verify state and get platform
    const stateData = verifyOAuthState(state);
    if (!stateData) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=invalid_state`
      );
    }

    const { platform } = stateData;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/callback`;

    // Exchange code for access token
    const tokenData = await exchangeCodeForToken(platform, code, redirectUri);
    
    // Get user profile
    const userProfile = await getUserProfile(platform, tokenData.access_token);

    // Get user from Supabase (we need to identify which user this is)
    // Note: In a real implementation, you'd need to pass user info through state or use session
    const supabase = createBrowserClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=user_not_found`
      );
    }

    // Save encrypted token to database
    await saveSocialToken(user.id, platform, tokenData.access_token, supabase);

    // Store additional token info if needed
    if (tokenData.refresh_token) {
      await supabase
        .from('social_tokens')
        .upsert({
          user_id: user.id,
          platform,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_in ? 
            new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
          user_profile: userProfile
        });
    }

    // Redirect to social page with success
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?success=${platform}&profile=${encodeURIComponent(JSON.stringify(userProfile))}`
    );

  } catch (error: any) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/social?error=${encodeURIComponent(error.message || 'Unknown error')}`
    );
  }
}
