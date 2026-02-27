// Direct API Test - Bypass Supabase Client
export async function testDirectAPI() {
  const SUPABASE_URL = 'https://wqqlcgwjkpbkxswcunxn.supabase.co';
  const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxcWxjZ3dqa3Bia3hzd2N1bnhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODE3MDcsImV4cCI6MjA4NzE1NzcwN30.h1sCZjLg1E46jSHekusOi1qIn5j9ngf5bDC-PirjtzQ';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: 'select 1'
      })
    });

    if (response.ok) {
      console.log('✅ Direct API works!');
      return true;
    } else {
      console.log('❌ Direct API failed:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return false;
  }
}

// Run in browser console: testDirectAPI()
