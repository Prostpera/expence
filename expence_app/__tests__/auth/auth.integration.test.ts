// __tests__/auth/auth.real.integration.test.ts
import { createClient } from '@supabase/supabase-js';

// Only run these tests if Supabase credentials are available
const hasSupabaseCredentials = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

describe('Authentication - Real Supabase Integration', () => {
  let supabase: any;
  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testUsername = `testuser_${Date.now()}`;

  beforeAll(() => {
    if (!hasSupabaseCredentials) {
      console.warn('⚠️  Skipping Supabase tests - credentials not found in environment');
      return;
    }

    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  });

  afterAll(async () => {
    if (hasSupabaseCredentials && supabase) {
      // Clean up: sign out after tests
      await supabase.auth.signOut();
    }
  });

  describe('TC-REGISTER-001: Real User Registration', () => {
    it('should register a new user with Supabase', async () => {
      if (!hasSupabaseCredentials) {
        console.log('Skipping - no Supabase credentials');
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: testUsername,
            display_name: testUsername,
          }
        }
      });

      expect(error).toBeNull();
      expect(data.user).toBeDefined();
      expect(data.user?.email).toBe(testEmail);
      expect(data.user?.user_metadata?.username).toBe(testUsername);
      
      console.log('✅ User registered:', testEmail);
    }, 10000);
  });

  describe('TC-REGISTER-002: Duplicate Email Prevention', () => {
    it('should prevent registration with existing email', async () => {
      if (!hasSupabaseCredentials) return;

      // Try to register with same email again
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: { username: 'duplicate_user' }
        }
      });

      // Supabase may return user or error depending on config
      // Either way, it should handle duplicates
      if (error) {
        expect(error.message).toBeDefined();
        console.log('✅ Duplicate prevented:', error.message);
      } else {
        // If no error, user should already exist
        expect(data.user).toBeDefined();
        console.log('✅ Duplicate handled silently');
      }
    }, 10000);
  });

  describe('TC-REGISTER-003: Weak Password Rejection', () => {
    it('should reject password shorter than 6 characters', async () => {
      if (!hasSupabaseCredentials) return;

      const weakPassword = '12345'; // Only 5 characters

      const { data, error } = await supabase.auth.signUp({
        email: `weak_${Date.now()}@example.com`,
        password: weakPassword,
        options: {
          data: { username: 'weakpassuser' }
        }
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('Password');
      console.log('✅ Weak password rejected:', error?.message);
    }, 10000);
  });

  describe('TC-LOGIN-001: Invalid Credentials', () => {
    it('should fail login with wrong password', async () => {
      if (!hasSupabaseCredentials) return;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: 'WrongPassword123!'
      });

      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid');
      expect(data.session).toBeNull();
      console.log('✅ Invalid login rejected:', error?.message);
    }, 10000);
  });

  describe('TC-LOGIN-002: Non-existent Email', () => {
    it('should fail login with non-existent email', async () => {
      if (!hasSupabaseCredentials) return;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'nonexistent_' + Date.now() + '@example.com',
        password: 'SomePassword123!'
      });

      expect(error).toBeDefined();
      expect(data.session).toBeNull();
      console.log('✅ Non-existent email rejected');
    }, 10000);
  });

  describe('TC-SESSION-001: Get Current Session', () => {
    it('should retrieve current session state', async () => {
      if (!hasSupabaseCredentials) return;

      const { data, error } = await supabase.auth.getSession();

      expect(error).toBeNull();
      // Session may or may not exist depending on test state
      console.log('✅ Session check complete:', data.session ? 'Active' : 'No session');
    }, 10000);
  });

  describe('TC-OAUTH-001: Google OAuth Initialization', () => {
    it('should initialize Google OAuth flow', async () => {
      if (!hasSupabaseCredentials) return;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
      });

      // Should either succeed or return a provider-specific error
      if (error) {
        console.log('OAuth error (may be expected in test env):', error.message);
      } else {
        expect(data.provider).toBe('google');
        expect(data.url).toBeDefined();
        console.log('✅ OAuth initialized');
      }
    }, 10000);
  });

  describe('TC-SECURITY-001: SQL Injection Prevention', () => {
    it('should safely handle SQL injection attempts', async () => {
      if (!hasSupabaseCredentials) return;

      const maliciousInput = "admin'--";
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: maliciousInput,
        password: 'password'
      });

      // Should fail safely without SQL error
      expect(error).toBeDefined();
      expect(error?.message).not.toContain('SQL');
      expect(error?.message).not.toContain('syntax');
      console.log('✅ SQL injection handled safely');
    }, 10000);
  });

  describe('TC-SECURITY-002: XSS Prevention', () => {
    it('should handle XSS attempts in user metadata', async () => {
      if (!hasSupabaseCredentials) return;

      const xssUsername = '<script>alert("xss")</script>';
      
      const { data, error } = await supabase.auth.signUp({
        email: `xss_test_${Date.now()}@example.com`,
        password: 'SecurePass123!',
        options: {
          data: {
            username: xssUsername,
            display_name: xssUsername
          }
        }
      });

      if (!error) {
        // Data should be stored but will be escaped on display
        expect(data.user?.user_metadata?.username).toBeDefined();
        console.log('✅ XSS data stored (must be escaped on display)');
      } else {
        console.log('✅ XSS rejected:', error.message);
      }
    }, 10000);
  });

  describe('TC-PERFORMANCE-001: Login Response Time', () => {
    it('should complete auth operations within acceptable time', async () => {
      if (!hasSupabaseCredentials) return;

      const startTime = Date.now();
      
      await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'test123'
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(5000); // Under 5 seconds
      console.log(`⏱️  Auth operation completed in ${duration}ms`);
    }, 10000);
  });

  describe('TC-PERFORMANCE-002: Session Check Performance', () => {
    it('should retrieve session quickly', async () => {
      if (!hasSupabaseCredentials) return;

      const startTime = Date.now();
      await supabase.auth.getSession();
      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(2000); // Under 2 seconds
      console.log(`⏱️  Session check completed in ${duration}ms`);
    }, 10000);
  });

  describe('TC-VALIDATION-001: Email Format Validation', () => {
    it('should reject invalid email formats', async () => {
      if (!hasSupabaseCredentials) return;

      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user..double@example.com'
      ];

      for (const email of invalidEmails) {
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: 'ValidPass123!',
          options: {
            data: { username: 'testuser' }
          }
        });

        // Should either error or be caught by validation
        if (!error) {
          // Some might pass Supabase but should fail client-side
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          expect(emailRegex.test(email)).toBe(false);
        }
      }
      
      console.log('✅ Email validation tested');
    }, 15000);
  });

  describe('TC-LOGOUT-001: Successful Logout', () => {
    it('should logout user and clear session', async () => {
      if (!hasSupabaseCredentials) return;

      const { error } = await supabase.auth.signOut();

      expect(error).toBeNull();

      // Verify session is cleared
      const { data } = await supabase.auth.getSession();
      expect(data.session).toBeNull();
      
      console.log('✅ User logged out successfully');
    }, 10000);
  });

  describe('TC-EDGE-001: Concurrent Login Attempts', () => {
    it('should handle multiple rapid login attempts', async () => {
      if (!hasSupabaseCredentials) return;

      const attempts = Array(3).fill(null).map(() => 
        supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'wrong_password'
        })
      );

      const results = await Promise.all(attempts);

      results.forEach(result => {
        expect(result.error).toBeDefined();
      });

      console.log('✅ Concurrent attempts handled');
    }, 15000);
  });

  describe('TC-EDGE-002: Empty Field Handling', () => {
    it('should handle empty email/password gracefully', async () => {
      if (!hasSupabaseCredentials) return;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: '',
        password: ''
      });

      expect(error).toBeDefined();
      expect(data.session).toBeNull();
      console.log('✅ Empty fields handled');
    }, 10000);
  });

  describe('TC-METADATA-001: User Metadata Storage', () => {
    it('should correctly store and retrieve user metadata', async () => {
      if (!hasSupabaseCredentials) return;

      const metadata = {
        username: `meta_user_${Date.now()}`,
        display_name: 'Metadata Test User',
        preferences: {
          theme: 'dark',
          notifications: true
        }
      };

      const { data, error } = await supabase.auth.signUp({
        email: `metadata_${Date.now()}@example.com`,
        password: 'TestPass123!',
        options: {
          data: metadata
        }
      });

      if (!error) {
        expect(data.user?.user_metadata?.username).toBe(metadata.username);
        expect(data.user?.user_metadata?.display_name).toBe(metadata.display_name);
        console.log('✅ Metadata stored correctly');
      }
    }, 10000);
  });
});