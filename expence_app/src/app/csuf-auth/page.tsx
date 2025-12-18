'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { ArrowLeft, ShieldCheck, Check, X, Eye, EyeOff } from 'lucide-react';

type MessageKind = 'error' | 'success' | 'info';

const decodeJwt = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(normalized);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

export default function CsufAuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [messageKind, setMessageKind] = useState<MessageKind>('info');
  const [submitting, setSubmitting] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [resetPassword, setResetPassword] = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetRequested, setResetRequested] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const passwordStrength = useMemo(() => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
  }, [password]);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(timer);
  }, [message]);

  const showMessage = (text: string, kind: MessageKind) => {
    setMessage(text);
    setMessageKind(kind);
  };

  const validateEmail = (value: string) => value.toLowerCase().endsWith('@csu.fullerton.edu');

  const validatePassword = () => {
    if (!passwordStrength.length) return 'Password must be at least 8 characters.';
    if (!passwordStrength.uppercase) return 'Password must include an uppercase letter.';
    if (!passwordStrength.lowercase) return 'Password must include a lowercase letter.';
    if (!passwordStrength.number) return 'Password must include a digit.';
    return null;
  };

  const validateResetPassword = (pwd: string) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(pwd)) return 'Password must include an uppercase letter.';
    if (!/[a-z]/.test(pwd)) return 'Password must include a lowercase letter.';
    if (!/\d/.test(pwd)) return 'Password must include a digit.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!validateEmail(email)) {
        showMessage('A valid csu.fullerton.edu email is required.', 'error');
        setSubmitting(false);
        return;
      }

      const pwErr = validatePassword();
      if (pwErr) {
        showMessage(pwErr, 'error');
        setSubmitting(false);
        return;
      }

      if (!isLogin && password !== confirm) {
        showMessage('Passwords must match.', 'error');
        setSubmitting(false);
        return;
      }

      const endpoint = isLogin ? '/api/csuf-auth/login' : '/api/csuf-auth/register';
      const payload = isLogin
        ? { email, password }
        : { email, password, fullName: fullName || undefined };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMessage = data?.error || 'Authentication failed.';
        if (
          isLogin &&
          (String(errorMessage).includes('UserNotConfirmedException') ||
            String(errorMessage).toLowerCase().includes('user is not confirmed'))
        ) {
          showMessage('Account not verified. Enter the verification code.', 'error');
          setPendingVerificationEmail(email);
          return;
        }
        showMessage(errorMessage, 'error');
        return;
      }

      if (isLogin) {
        const idToken = data?.tokens?.idToken as string | undefined;
        const claims = idToken ? decodeJwt(idToken) : null;
        const profile = {
          email,
          name: (claims?.name as string | undefined) || (claims?.['cognito:username'] as string | undefined) || email
        };

        sessionStorage.setItem('csufTokens', JSON.stringify(data.tokens));
        sessionStorage.setItem('csufProfile', JSON.stringify(profile));
        showMessage('Login successful. Redirecting...', 'success');
        setTimeout(() => {
          router.push('/dashboard');
        }, 500);
      } else {
        showMessage(data?.message || 'Registration successful. Check your email to verify.', 'success');
        setPendingVerificationEmail(email);
        setVerificationCode('');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      showMessage(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingVerificationEmail) {
      showMessage('No pending verification email found.', 'error');
      return;
    }
    if (!verificationCode.trim()) {
      showMessage('Enter your verification code.', 'error');
      return;
    }

    setVerifyLoading(true);
    try {
      const res = await fetch('/api/csuf-auth/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingVerificationEmail, code: verificationCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data?.error || 'Verification failed.', 'error');
        return;
      }
      showMessage(data?.message || 'Account verified. You can log in.', 'success');
      setPendingVerificationEmail('');
      setVerificationCode('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      showMessage(msg, 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pendingVerificationEmail) {
      showMessage('No email to resend code to.', 'error');
      return;
    }
    setResendLoading(true);
    try {
      const res = await fetch('/api/csuf-auth/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingVerificationEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data?.error || 'Failed to resend code.', 'error');
        return;
      }
      showMessage(data?.message || 'Verification code resent.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      showMessage(msg, 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleForgotToggle = () => {
    if (forgotOpen) {
      setResetRequested(false);
      setResetCode('');
      setResetPassword('');
      setResetConfirm('');
    } else if (!resetEmail && email) {
      setResetEmail(email);
    }
    setForgotOpen((prev) => !prev);
  };

  const handleForgotStart = async () => {
    if (!resetEmail.trim()) {
      showMessage('Enter your CSUF email to reset your password.', 'error');
      return;
    }
    setResetLoading(true);
    try {
      const res = await fetch('/api/csuf-auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data?.error || 'Failed to send reset code.', 'error');
        return;
      }
      setResetRequested(true);
      showMessage(data?.message || 'Reset code sent to your email.', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      showMessage(msg, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const handleForgotConfirm = async () => {
    if (!resetCode.trim()) {
      showMessage('Enter the verification code.', 'error');
      return;
    }
    if (!resetPassword) {
      showMessage('Enter a new password.', 'error');
      return;
    }
    if (resetPassword !== resetConfirm) {
      showMessage('Passwords do not match.', 'error');
      return;
    }

    const pwError = validateResetPassword(resetPassword);
    if (pwError) {
      showMessage(pwError, 'error');
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch('/api/csuf-auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: resetEmail.trim(),
          code: resetCode.trim(),
          newPassword: resetPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showMessage(data?.error || 'Password reset failed.', 'error');
        return;
      }
      showMessage(data?.message || 'Password reset successfully.', 'success');
      setResetCode('');
      setResetPassword('');
      setResetConfirm('');
      setResetRequested(false);
      setForgotOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unexpected error';
      showMessage(msg, 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const renderStrengthRow = (label: string, pass: boolean) => (
    <div className={`flex items-center space-x-2 ${pass ? 'text-green-400' : 'text-red-400'}`}>
      {pass ? <Check size={12} /> : <X size={12} />}
      <span className="text-xs">{label}</span>
    </div>
  );

  return (
    <>
      <Head>
        <title>CSUF Student Access</title>
      </Head>
      <main className="min-h-screen bg-gray-950 flex items-center justify-center font-inter px-4">
        <div className="w-full max-w-3xl border border-purple-700 bg-gray-900/60 backdrop-blur-md rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="text-purple-400" size={24} />
              <div>
                <div className="text-purple-200 text-sm uppercase">CSUF Students</div>
                <div className="text-white font-bold text-xl">AWS Cognito Login</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-purple-300 hover:text-white inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to main login
            </button>
          </div>

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 px-4 py-2 uppercase text-sm border ${
                isLogin ? 'bg-purple-700 text-white border-purple-500' : 'border-purple-700 text-purple-200'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 px-4 py-2 uppercase text-sm border ${
                !isLogin ? 'bg-purple-700 text-white border-purple-500' : 'border-purple-700 text-purple-200'
              }`}
            >
              Register
            </button>
          </div>

          {message ? (
            <div
              className={`mb-4 p-3 border text-sm ${
                messageKind === 'error'
                  ? 'border-red-600 text-red-200 bg-red-900/30'
                  : messageKind === 'success'
                    ? 'border-green-600 text-green-200 bg-green-900/30'
                    : 'border-cyan-600 text-cyan-200 bg-cyan-900/30'
              }`}
            >
              {message}
            </div>
          ) : null}

          {pendingVerificationEmail && (
            <form onSubmit={handleVerify} className="mb-6 space-y-3 border border-purple-700 bg-gray-900/70 p-4">
              <div className="text-xs uppercase text-purple-200">Verify CSUF account</div>
              <div className="text-sm text-purple-100">
                Code sent to <span className="text-purple-200">{pendingVerificationEmail}</span>
              </div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                placeholder="Enter verification code"
                disabled={verifyLoading}
              />
              <button
                type="submit"
                disabled={verifyLoading}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white uppercase py-2 border border-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {verifyLoading ? 'Verifying...' : 'Verify Email'}
              </button>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="w-full border border-purple-500 text-purple-200 uppercase py-2 hover:bg-purple-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {resendLoading ? 'Resending...' : 'Resend Code'}
              </button>
            </form>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-purple-200 mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                  disabled={submitting}
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-purple-200 mb-1">CSUF Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                placeholder="name@csu.fullerton.edu"
                required
                disabled={submitting}
              />
            </div>

            <div>
              <label className="block text-sm text-purple-200 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 pr-10 outline-none focus:border-purple-400"
                  placeholder="Min 8 chars, upper, lower, number"
                  required
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
                  disabled={submitting}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm text-purple-200 mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 pr-10 outline-none focus:border-purple-400"
                    required
                    disabled={submitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-300 hover:text-purple-100"
                    disabled={submitting}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="bg-gray-800 border border-purple-800 p-3 rounded">
                <div className="text-xs text-purple-200 mb-2">Password requirements</div>
                <div className="space-y-1">
                  {renderStrengthRow('At least 8 characters', passwordStrength.length)}
                  {renderStrengthRow('One uppercase letter', passwordStrength.uppercase)}
                  {renderStrengthRow('One lowercase letter', passwordStrength.lowercase)}
                  {renderStrengthRow('One number', passwordStrength.number)}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white uppercase py-3 font-semibold border border-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          {isLogin && (
            <div className="mt-4">
              <button
                type="button"
                onClick={handleForgotToggle}
                className="text-sm text-purple-300 hover:text-purple-100"
              >
                {forgotOpen ? 'Hide password reset' : 'Forgot password?'}
              </button>

              {forgotOpen && (
                <div className="mt-3 space-y-3 border border-purple-700 bg-gray-900/70 p-4">
                  <div className="text-xs uppercase text-purple-200">Reset password</div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                    placeholder="name@csu.fullerton.edu"
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={handleForgotStart}
                    disabled={resetLoading}
                    className="w-full border border-purple-500 text-purple-100 uppercase py-2 hover:bg-purple-900/40 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {resetLoading ? 'Sending...' : 'Send reset code'}
                  </button>

                  {resetRequested && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value)}
                        className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                        placeholder="Verification code"
                        disabled={resetLoading}
                      />
                      <input
                        type="password"
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                        placeholder="New password"
                        disabled={resetLoading}
                      />
                      <input
                        type="password"
                        value={resetConfirm}
                        onChange={(e) => setResetConfirm(e.target.value)}
                        className="w-full bg-gray-800 border border-purple-700 text-white px-3 py-2 outline-none focus:border-purple-400"
                        placeholder="Confirm new password"
                        disabled={resetLoading}
                      />
                      <button
                        type="button"
                        onClick={handleForgotConfirm}
                        disabled={resetLoading}
                        className="w-full bg-purple-700 hover:bg-purple-600 text-white uppercase py-2 border border-purple-400 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {resetLoading ? 'Resetting...' : 'Reset password'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
