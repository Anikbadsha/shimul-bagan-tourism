import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ubaonkyyxanwwtbudafn.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InViYW9ua3l5eGFud3d0YnVkYWZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzkxMzQ0NywiZXhwIjoyMTAzNDg5NDQ3fQ.pVVxdrQCksr6bOf-ON6-JBXX83oJkjIlw4EPyY2zP_s';

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log('=== Creating Admin User ===\n');

  const email = 'anik.badsha@gmail.com';
  const password = 'Admin@123';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      role: 'admin',
      full_name: 'Anik Badsha'
    }
  });

  if (error) {
    if (error.message.includes('already')) {
      console.log('User already exists. Signing in to verify...');
      const { data: signIn, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInError) {
        console.log('Sign-in failed:', signInError.message);
      } else {
        console.log('Admin user verified and can sign in!');
        console.log('User ID:', signIn.user.id);
      }
    } else {
      console.log('Error creating user:', error.message);
    }
  } else {
    console.log('Admin user created successfully!');
    console.log('User ID:', data.user.id);
    console.log('Email:', data.user.email);
  }

  console.log('\n=== Auth Setup Complete ===');
}

main().catch(console.error);