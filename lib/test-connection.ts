// Supabase Connection Test
import { createBrowserClient } from '@/lib/supabase';

export async function testSupabaseConnection() {
  try {
    const supabase = createBrowserClient();
    
    // Test basic connection
    const { data, error } = await supabase
      .from('brands')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase Error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
    
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

// Run this in browser console: testSupabaseConnection()
