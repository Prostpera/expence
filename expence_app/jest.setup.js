import '@testing-library/jest-dom';

const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = class ReadableStream {
    constructor() {}
  };
}

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: '',
      asPath: '',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Set test environment variables
process.env.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Mock Next.js navigation (App Router)
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Suppress console errors for known React warnings
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
       args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
       args[0].includes('Warning: useLayoutEffect does nothing on the server'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps has been renamed')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Global test timeout for API calls
jest.setTimeout(15000);

// Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for animations and lazy loading
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock ResizeObserver for responsive components
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.location for redirect tests
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  reload: jest.fn(),
  replace: jest.fn(),
  assign: jest.fn(),
};

// Custom matchers for authentication tests
expect.extend({
  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a valid email`,
      pass,
    };
  },
  
  toBeStrongPassword(received) {
    const pass = typeof received === 'string' && received.length >= 6;
    
    return {
      message: () => `expected ${received} ${pass ? 'not ' : ''}to be a strong password (min 6 chars)`,
      pass,
    };
  },
  
  toBeWithinTimeLimit(received, limit) {
    const pass = received <= limit;
    
    return {
      message: () => `expected ${received}ms ${pass ? 'not ' : ''}to be within ${limit}ms`,
      pass,
    };
  },

  toHaveValidSession(received) {
    const pass = received && 
                 received.access_token && 
                 received.user && 
                 received.user.id;
    
    return {
      message: () => `expected ${pass ? 'not ' : ''}to have a valid session structure`,
      pass,
    };
  },

  toBeSupabaseError(received) {
    const pass = received && 
                 typeof received === 'object' && 
                 'message' in received;
    
    return {
      message: () => `expected ${pass ? 'not ' : ''}to be a Supabase error object`,
      pass,
    };
  }
});

console.log('\nJest Test Environment Setup Complete');
console.log('==========================================');
console.log(`Site URL: ${process.env.NEXT_PUBLIC_SITE_URL}`);
console.log(`Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Not configured'}`);
console.log(`Supabase Key: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Not configured'}`);
console.log(`Anthropic API: ${process.env.ANTHROPIC_API_KEY ? 'Configured' : 'Not configured'}`);
console.log(`Test Timeout: 15000ms`);
console.log('==========================================\n');

if (process.argv.some(arg => arg.includes('auth.real.integration'))) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('WARNING: Running integration tests without Supabase credentials!');
    console.warn('Tests will be skipped. Add credentials to .env.local to run them.\n');
  }
}