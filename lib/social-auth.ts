/**
 * Real-time Social Media OAuth Integration
 * Instagram, Facebook, LinkedIn API Handlers
 */

export interface SocialPlatform {
  id: string;
  name: string;
  oauthUrl: string;
  scopes: string[];
  clientId: string;
}

export interface OAuthResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  user_profile?: any;
}

// Platform configurations
export const SOCIAL_PLATFORMS: Record<string, SocialPlatform> = {
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    oauthUrl: 'https://api.instagram.com/oauth/authorize',
    scopes: ['user_profile', 'user_media', 'instagram_content_publish'],
    clientId: process.env.INSTAGRAM_CLIENT_ID || ''
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    oauthUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_show_list'],
    clientId: process.env.FACEBOOK_CLIENT_ID || ''
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    oauthUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: ['r_liteprofile', 'w_member_social', 'r_organization_admin'],
    clientId: process.env.LINKEDIN_CLIENT_ID || ''
  }
};

/**
 * Generate OAuth URL for platform
 */
export function generateOAuthUrl(platform: SocialPlatform, redirectUri: string, state: string): string {
  const params = new URLSearchParams({
    client_id: platform.clientId,
    redirect_uri: redirectUri,
    scope: platform.scopes.join(' '),
    response_type: 'code',
    state: state
  });

  return `${platform.oauthUrl}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  platform: string,
  code: string,
  redirectUri: string
): Promise<OAuthResponse> {
  const tokenUrl = getTokenUrl(platform);
  const clientId = getClientId(platform);
  const clientSecret = getClientSecret(platform);

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: redirectUri
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Get user profile from platform
 */
export async function getUserProfile(platform: string, accessToken: string): Promise<any> {
  const profileUrl = getProfileUrl(platform);

  const response = await fetch(profileUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Profile fetch failed: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Verify token is still valid
 */
export async function verifyToken(platform: string, accessToken: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(platform, accessToken);
    return !!profile;
  } catch (error) {
    return false;
  }
}

/**
 * Refresh access token if needed
 */
export async function refreshToken(platform: string, refreshToken: string): Promise<OAuthResponse> {
  const tokenUrl = getTokenUrl(platform);
  const clientId = getClientId(platform);
  const clientSecret = getClientSecret(platform);

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString()
  });

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${response.statusText}`);
  }

  return await response.json();
}

// Helper functions
function getTokenUrl(platform: string): string {
  const urls = {
    instagram: 'https://api.instagram.com/oauth/access_token',
    facebook: 'https://graph.facebook.com/v18.0/oauth/access_token',
    linkedin: 'https://www.linkedin.com/oauth/v2/accessToken'
  };
  return urls[platform as keyof typeof urls] || '';
}

function getProfileUrl(platform: string): string {
  const urls = {
    instagram: 'https://graph.instagram.com/me?fields=id,username,account_type,media_count',
    facebook: 'https://graph.facebook.com/me?fields=id,name,email',
    linkedin: 'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
  };
  return urls[platform as keyof typeof urls] || '';
}

function getClientId(platform: string): string {
  const clients = {
    instagram: process.env.INSTAGRAM_CLIENT_ID || '',
    facebook: process.env.FACEBOOK_CLIENT_ID || '',
    linkedin: process.env.LINKEDIN_CLIENT_ID || ''
  };
  return clients[platform as keyof typeof clients] || '';
}

function getClientSecret(platform: string): string {
  const secrets = {
    instagram: process.env.INSTAGRAM_CLIENT_SECRET || '',
    facebook: process.env.FACEBOOK_CLIENT_SECRET || '',
    linkedin: process.env.LINKEDIN_CLIENT_SECRET || ''
  };
  return secrets[platform as keyof typeof secrets] || '';
}

/**
 * Generate secure state parameter for OAuth
 */
export function generateState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Store OAuth state in session storage
 */
export function storeOAuthState(state: string, platform: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`oauth_state_${state}`, JSON.stringify({
      platform,
      timestamp: Date.now()
    }));
  }
}

/**
 * Verify and retrieve OAuth state
 */
export function verifyOAuthState(state: string): { platform: string } | null {
  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(`oauth_state_${state}`);
    if (stored) {
      const data = JSON.parse(stored);
      sessionStorage.removeItem(`oauth_state_${state}`);
      
      // Check if state is not too old (5 minutes)
      if (Date.now() - data.timestamp < 5 * 60 * 1000) {
        return { platform: data.platform };
      }
    }
  }
  return null;
}
