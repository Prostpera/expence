// __tests__/utils/authTestUtils.ts

/**
 * Test utilities for authentication tests
 * Similar to testUtils.ts for AI quest tests
 */

// Mock user data for testing
export const mockUsers = {
  validUser: {
    id: 'user-123',
    email: 'testuser@example.com',
    user_metadata: {
      username: 'testuser',
      display_name: 'Test User'
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  newUser: {
    id: 'user-456',
    email: 'newuser@example.com',
    user_metadata: {
      username: 'newuser',
      display_name: 'New User'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  unverifiedUser: {
    id: 'user-789',
    email: 'unverified@example.com',
    email_confirmed_at: null,
    user_metadata: {
      username: 'unverifieduser',
      display_name: 'Unverified User'
    }
  }
};

// Mock session data
export const mockSessions = {
  validSession: {
    access_token: 'mock-access-token-abc123',
    refresh_token: 'mock-refresh-token-xyz789',
    expires_in: 3600,
    token_type: 'bearer',
    user: mockUsers.validUser
  },
  expiredSession: {
    access_token: 'expired-token',
    refresh_token: 'expired-refresh',
    expires_in: -1,
    token_type: 'bearer',
    user: mockUsers.validUser
  }
};

// Mock authentication responses
export const mockAuthResponses = {
  successfulLogin: {
    data: {
      user: mockUsers.validUser,
      session: mockSessions.validSession
    },
    error: null
  },
  failedLogin: {
    data: {
      user: null,
      session: null
    },
    error: {
      message: 'Invalid login credentials',
      status: 400
    }
  },
  unverifiedEmail: {
    data: {
      user: null,
      session: null
    },
    error: {
      message: 'Email not confirmed',
      status: 400
    }
  },
  successfulSignup: {
    data: {
      user: mockUsers.newUser,
      session: null // No session until email verified
    },
    error: null
  },
  duplicateEmail: {
    data: {
      user: null,
      session: null
    },
    error: {
      message: 'User already registered',
      status: 422
    }
  },
  weakPassword: {
    data: {
      user: null,
      session: null
    },
    error: {
      message: 'Password should be at least 6 characters',
      status: 422
    }
  },
  googleOAuthSuccess: {
    data: {
      provider: 'google',
      url: 'https://accounts.google.com/o/oauth2/v2/auth?...'
    },
    error: null
  },
  googleOAuthError: {
    data: {
      provider: null,
      url: null
    },
    error: {
      message: 'OAuth provider error',
      status: 500
    }
  }
};

// Test credentials
export const testCredentials = {
  valid: {
    email: 'testuser@example.com',
    password: 'ValidPassword123!',
    username: 'testuser'
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'WrongPassword',
    username: 'wronguser'
  },
  weak: {
    email: 'weak@example.com',
    password: '12345', // Too short
    username: 'weakuser'
  },
  malicious: {
    sqlInjection: "admin'--",
    xssScript: '<script>alert("xss")</script>',
    noSqlInjection: '{ $ne: null }',
    pathTraversal: '../../../etc/passwd'
  }
};

// OAuth codes for callback testing
export const mockOAuthCodes = {
  valid: 'valid-oauth-code-abc123xyz',
  invalid: 'invalid-code-xyz',
  expired: 'expired-code-old',
  used: 'already-used-code'
};

// Helper function to generate unique test email
export const generateTestEmail = (): string => {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}@example.com`;
};

// Helper function to generate unique username
export const generateTestUsername = (): string => {
  return `testuser_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

// Helper function to create mock Supabase client
export const createMockSupabaseClient = (overrides = {}) => {
  return {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn(),
      getSession: jest.fn(),
      signOut: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      ...overrides
    }
  };
};

// Helper to wait for async operations
export const waitForAsync = (ms: number = 100) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Validate username
export const isValidUsername = (username: string): boolean => {
  return username.length > 0 && username.length <= 20;
};

// Sanitize input (basic XSS prevention)
export const sanitizeInput = (input: string): string => {
  return input.replace(/<[^>]*>/g, '');
};

// Mock error messages matching Supabase
export const supabaseErrorMessages = {
  INVALID_CREDENTIALS: 'Invalid login credentials',
  EMAIL_NOT_CONFIRMED: 'Email not confirmed',
  USER_EXISTS: 'User already registered',
  WEAK_PASSWORD: 'Password should be at least 6 characters',
  INVALID_EMAIL: 'Invalid email format',
  OAUTH_ERROR: 'OAuth provider error',
  NETWORK_ERROR: 'Network request failed',
  INVALID_CODE: 'Invalid OAuth code',
  CODE_EXPIRED: 'OAuth code expired',
  CODE_USED: 'Code already used'
};

// Test data for different user contexts
export const mockUserContexts = {
  beginner: {
    userId: 'beginner-user-123',
    email: 'beginner@example.com',
    username: 'beginner_user',
    accountAge: 1, // days
    loginCount: 5
  },
  intermediate: {
    userId: 'intermediate-user-456',
    email: 'intermediate@example.com',
    username: 'intermediate_user',
    accountAge: 30,
    loginCount: 50
  },
  advanced: {
    userId: 'advanced-user-789',
    email: 'advanced@example.com',
    username: 'advanced_user',
    accountAge: 365,
    loginCount: 500
  }
};

// Helper to create test session
export const createTestSession = (userId: string, email: string) => ({
  access_token: `token_${userId}`,
  refresh_token: `refresh_${userId}`,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: userId,
    email: email,
    user_metadata: {
      username: email.split('@')[0],
      display_name: email.split('@')[0]
    }
  }
});

// Helper to simulate loading state
export const simulateLoadingDelay = (ms: number = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Performance measurement helper
export const measurePerformance = async (fn: () => Promise<any>) => {
  const startTime = Date.now();
  const result = await fn();
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  return {
    result,
    duration,
    performanceLog: `Operation completed in ${duration}ms`
  };
};

// Helper for batch operations
export const executeBatch = async <T>(
  operations: (() => Promise<T>)[],
  options = { parallel: true }
): Promise<T[]> => {
  if (options.parallel) {
    return Promise.all(operations.map(op => op()));
  } else {
    const results: T[] = [];
    for (const operation of operations) {
      results.push(await operation());
    }
    return results;
  }
};

// Security test helpers
export const securityTestInputs = {
  sqlInjection: [
    "admin'--",
    "1' OR '1'='1",
    "'; DROP TABLE users--",
    "admin' /*",
    "' UNION SELECT NULL--"
  ],
  xssAttempts: [
    '<script>alert("xss")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
    '<svg onload=alert(1)>',
    '<iframe src="javascript:alert(1)">'
  ],
  noSqlInjection: [
    '{ $ne: null }',
    '{ $gt: "" }',
    '{ $regex: ".*" }'
  ],
  pathTraversal: [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32',
    '....//....//....//etc/passwd'
  ]
};

// Rate limiting helper (for testing)
export const simulateRateLimit = (attempts: number, windowMs: number = 60000) => {
  const now = Date.now();
  const window = now - windowMs;
  
  return {
    isLimited: attempts > 5,
    remainingAttempts: Math.max(0, 5 - attempts),
    resetTime: now + windowMs
  };
};

// Mock NextRequest for testing
export const createMockNextRequest = (url: string, options = {}) => {
  return {
    url,
    method: 'GET',
    headers: new Headers(),
    ...options
  };
};

// Validation helpers
export const validators = {
  email: (email: string) => ({
    isValid: isValidEmail(email),
    error: isValidEmail(email) ? null : 'Invalid email format'
  }),
  
  password: (password: string) => ({
    isValid: isStrongPassword(password),
    error: isStrongPassword(password) ? null : 'Password must be at least 6 characters'
  }),
  
  username: (username: string) => ({
    isValid: isValidUsername(username),
    error: isValidUsername(username) ? null : 'Username must be 1-20 characters'
  })
};

// Test environment checker
export const hasTestEnvironment = () => ({
  hasSupabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
  isCI: !!process.env.CI,
  nodeEnv: process.env.NODE_ENV
});