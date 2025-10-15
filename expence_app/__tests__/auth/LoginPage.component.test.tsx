// __tests__/auth/LoginPage.component.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Supabase
const mockSignInWithPassword = jest.fn();
const mockSignUp = jest.fn();
const mockSignInWithOAuth = jest.fn();
const mockGetSession = jest.fn();

jest.mock('@/lib/supabase', () => ({
  createClientSupabase: () => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
      signInWithOAuth: mockSignInWithOAuth,
      getSession: mockGetSession,
    }
  })
}));

// Import component after mocks
import Home from '@/app/page';

describe('Login Page UI Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
  });

  describe('TC-UI-001: Initial Page Render', () => {
    it('should render all essential UI elements', async () => {
      render(<Home />);

      await waitFor(() => {
        // Check for branding
        expect(screen.getByText(/EXPence App/i)).toBeInTheDocument();
        
        // Check for warning message
        expect(screen.getByText(/WARNING/i)).toBeInTheDocument();
        expect(screen.getByText(/Access to EXPence System requires credentials/i)).toBeInTheDocument();
        
        // Check for form fields
        expect(screen.getByPlaceholderText(/user@domain.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
        
        // Check for buttons
        expect(screen.getByRole('button', { name: /\[LOGIN\]/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\[REGISTER\]/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\[Enter System\]/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /CONNECT WITH GOOGLE/i })).toBeInTheDocument();
      });
    });

    it('should display security badges', async () => {
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByText(/SECURE OAUTH 2.0 AUTHENTICATION/i)).toBeInTheDocument();
        expect(screen.getByText(/CCPA\/GDPR COMPLIANT/i)).toBeInTheDocument();
        expect(screen.getByText(/SOC 2 TYPE II/i)).toBeInTheDocument();
        expect(screen.getByText(/AI-POWERED FINANCIAL EDUCATION/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC-UI-002: Mode Toggle Functionality', () => {
    it('should show LOGIN mode by default', async () => {
      render(<Home />);

      await waitFor(() => {
        const loginButton = screen.getByRole('button', { name: /\[LOGIN\]/i });
        expect(loginButton).toHaveClass('bg-purple-600');
        
        // Username field should NOT be visible in login mode
        expect(screen.queryByPlaceholderText(/Choose username/i)).not.toBeInTheDocument();
      });
    });

    it('should switch to REGISTER mode when clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /\[REGISTER\]/i })).toBeInTheDocument();
      });

      const registerButton = screen.getByRole('button', { name: /\[REGISTER\]/i });
      await user.click(registerButton);

      await waitFor(() => {
        // Username field should appear
        expect(screen.getByPlaceholderText(/Choose username/i)).toBeInTheDocument();
        
        // Button text should change
        expect(screen.getByRole('button', { name: /\[Register User\]/i })).toBeInTheDocument();
        
        // Register button should be active
        expect(registerButton).toHaveClass('bg-purple-600');
      });
    });

    it('should switch back to LOGIN mode', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // First switch to register
      const registerButton = screen.getByRole('button', { name: /\[REGISTER\]/i });
      await user.click(registerButton);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Choose username/i)).toBeInTheDocument();
      });

      // Then switch back to login
      const loginButton = screen.getByRole('button', { name: /\[LOGIN\]/i });
      await user.click(loginButton);

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Choose username/i)).not.toBeInTheDocument();
        expect(screen.getByRole('button', { name: /\[Enter System\]/i })).toBeInTheDocument();
      });
    });
  });

  describe('TC-UI-003: Form Input Handling', () => {
    it('should allow typing in email field', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      await user.type(emailInput, 'test@example.com');

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('should allow typing in password field', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);
      await user.type(passwordInput, 'SecurePass123!');

      expect(passwordInput).toHaveValue('SecurePass123!');
    });

    it('should allow typing in username field (register mode)', async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Switch to register mode
      const registerButton = screen.getByRole('button', { name: /\[REGISTER\]/i });
      await user.click(registerButton);

      const usernameInput = await screen.findByPlaceholderText(/Choose username/i);
      await user.type(usernameInput, 'testuser123');

      expect(usernameInput).toHaveValue('testuser123');
    });
  });

  describe('TC-UI-004: Password Visibility Toggle', () => {
    it('should toggle password visibility when eye icon clicked', async () => {
      const user = userEvent.setup();
      render(<Home />);

      const passwordInput = await screen.findByPlaceholderText(/Enter password/i) as HTMLInputElement;
      await user.type(passwordInput, 'SecretPass123');

      // Password should be hidden by default
      expect(passwordInput.type).toBe('password');

      // Find and click the eye icon button
      const toggleButtons = screen.getAllByRole('button');
      const eyeButton = toggleButtons.find(btn => 
        btn.querySelector('svg') && btn.getAttribute('type') === 'button'
      );

      if (eyeButton) {
        await user.click(eyeButton);
        
        await waitFor(() => {
          expect(passwordInput.type).toBe('text');
        });

        // Click again to hide
        await user.click(eyeButton);
        
        await waitFor(() => {
          expect(passwordInput.type).toBe('password');
        });
      }
    });
  });

  describe('TC-UI-005: Form Submission - Login', () => {
    it('should call signInWithPassword on login form submit', async () => {
      const user = userEvent.setup();
      mockSignInWithPassword.mockResolvedValue({
        data: { 
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token' }
        },
        error: null
      });

      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);
      const submitButton = screen.getByRole('button', { name: /\[Enter System\]/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignInWithPassword).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'TestPass123!'
        });
      });
    });

    it('should show success message on successful login', async () => {
      const user = userEvent.setup();
      mockSignInWithPassword.mockResolvedValue({
        data: { 
          user: { id: '123', email: 'test@example.com' },
          session: { access_token: 'token' }
        },
        error: null
      });

      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);
      const submitButton = screen.getByRole('button', { name: /\[Enter System\]/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'TestPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/LOGIN SUCCESSFUL - ACCESSING SYSTEM/i)).toBeInTheDocument();
      });
    });

    it('should show error message on failed login', async () => {
      const user = userEvent.setup();
      mockSignInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' }
      });

      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);
      const submitButton = screen.getByRole('button', { name: /\[Enter System\]/i });

      await user.type(emailInput, 'wrong@example.com');
      await user.type(passwordInput, 'WrongPass');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/INVALID CREDENTIALS - ACCESS DENIED/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC-UI-006: Form Submission - Register', () => {
    it('should call signUp on register form submit', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({
        data: { 
          user: { id: '123', email: 'newuser@example.com' },
          session: null
        },
        error: null
      });

      render(<Home />);

      // Switch to register mode
      const registerButton = screen.getByRole('button', { name: /\[REGISTER\]/i });
      await user.click(registerButton);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const usernameInput = await screen.findByPlaceholderText(/Choose username/i);
      const passwordInput = await screen.findByPlaceholderText(/Min 6 characters/i);
      const submitButton = screen.getByRole('button', { name: /\[Register User\]/i });

      await user.type(emailInput, 'newuser@example.com');
      await user.type(usernameInput, 'newuser');
      await user.type(passwordInput, 'NewPass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'newuser@example.com',
          password: 'NewPass123!',
          options: {
            data: {
              username: 'newuser',
              display_name: 'newuser'
            }
          }
        });
      });
    });

    it('should show verification email message on successful registration', async () => {
      const user = userEvent.setup();
      mockSignUp.mockResolvedValue({
        data: { user: { id: '123' }, session: null },
        error: null
      });

      render(<Home />);

      const registerButton = screen.getByRole('button', { name: /\[REGISTER\]/i });
      await user.click(registerButton);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const usernameInput = await screen.findByPlaceholderText(/Choose username/i);
      const passwordInput = await screen.findByPlaceholderText(/Min 6 characters/i);
      const submitButton = screen.getByRole('button', { name: /\[Register User\]/i });

      await user.type(emailInput, 'new@example.com');
      await user.type(usernameInput, 'newuser');
      await user.type(passwordInput, 'Pass123!');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/VERIFICATION EMAIL SENT - CHECK INBOX/i)).toBeInTheDocument();
      });
    });
  });

  describe('TC-UI-007: Google OAuth Button', () => {
    it('should call signInWithOAuth when Google button clicked', async () => {
      const user = userEvent.setup();
      mockSignInWithOAuth.mockResolvedValue({
        data: { provider: 'google', url: 'https://accounts.google.com/...' },
        error: null
      });

      render(<Home />);

      const googleButton = await screen.findByRole('button', { name: /CONNECT WITH GOOGLE/i });
      await user.click(googleButton);

      await waitFor(() => {
        expect(mockSignInWithOAuth).toHaveBeenCalledWith({
          provider: 'google',
          options: {
            redirectTo: expect.stringContaining('/auth/callback')
          }
        });
      });
    });
  });

  describe('TC-UI-008: Loading States', () => {
    it('should disable form during submission', async () => {
      const user = userEvent.setup();
      mockSignInWithPassword.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          data: { user: { id: '123' }, session: { access_token: 'token' } },
          error: null
        }), 1000))
      );

      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);
      const submitButton = screen.getByRole('button', { name: /\[Enter System\]/i });

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'Pass123!');
      await user.click(submitButton);

      // Button should show loading state
      await waitFor(() => {
        expect(screen.getByText(/ACCESSING.../i)).toBeInTheDocument();
      });
    });
  });

  describe('TC-UI-009: Redirect on Existing Session', () => {
    it('should redirect to dashboard if user already logged in', async () => {
      mockGetSession.mockResolvedValue({
        data: { 
          session: {
            access_token: 'existing-token',
            user: { id: '123', email: 'test@example.com' }
          }
        },
        error: null
      });

      render(<Home />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('TC-UI-010: Accessibility', () => {
    it('should have proper form structure', async () => {
      render(<Home />);

      const emailInput = await screen.findByPlaceholderText(/user@domain.com/i);
      const passwordInput = await screen.findByPlaceholderText(/Enter password/i);

      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(emailInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('required');
    });
  });
});