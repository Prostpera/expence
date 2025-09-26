'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { createClientSupabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');
  
  const supabase = createClientSupabase();
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    const flickerInterval = setInterval(() => {
      setFlicker(prev => !prev);
    }, 4000);

    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkUser();

    return () => {
      clearTimeout(timer);
      clearInterval(flickerInterval);
    };
  }, []);

  const showMessage = (text: string, type: 'error' | 'success' | 'info') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            showMessage('INVALID CREDENTIALS - ACCESS DENIED', 'error');
          } else if (error.message.includes('Email not confirmed')) {
            showMessage('EMAIL VERIFICATION REQUIRED', 'error');
          } else {
            showMessage(`LOGIN ERROR: ${error.message}`, 'error');
          }
        } else {
          showMessage('LOGIN SUCCESSFUL - ACCESSING SYSTEM...', 'success');
          setTimeout(() => router.push('/dashboard'), 1000);
        }
      } else {
        // Sign up
        if (!username.trim()) {
          showMessage('USERNAME REQUIRED FOR REGISTRATION', 'error');
          setAuthLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
              display_name: username,
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            showMessage('USER ALREADY EXISTS - TRY LOGIN', 'error');
          } else if (error.message.includes('Password should be')) {
            showMessage('PASSWORD TOO WEAK - STRENGTHEN SECURITY', 'error');
          } else {
            showMessage(`REGISTRATION ERROR: ${error.message}`, 'error');
          }
        } else {
          showMessage('VERIFICATION EMAIL SENT - CHECK INBOX', 'success');
          setIsLogin(true);
        }
      }
    } catch (error) {
      showMessage('SYSTEM ERROR - TRY AGAIN LATER', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        showMessage(`GOOGLE AUTH ERROR: ${error.message}`, 'error');
        setAuthLoading(false);
      }
      // Don't set loading to false here - redirect will handle it
    } catch (error) {
      showMessage('GOOGLE AUTH SYSTEM ERROR', 'error');
      setAuthLoading(false);
    }
  };

  const MessageDisplay = () => {
    if (!message) return null;

    const messageStyles = {
      error: 'border-red-500 bg-red-900/20 text-red-300',
      success: 'border-green-500 bg-green-900/20 text-green-300',
      info: 'border-cyan-500 bg-cyan-900/20 text-cyan-300'
    };

    const MessageIcon = () => {
      switch (messageType) {
        case 'error':
          return <AlertTriangle className="w-4 h-4" />;
        case 'success':
          return <CheckCircle className="w-4 h-4" />;
        default:
          return <AlertTriangle className="w-4 h-4" />;
      }
    };

    return (
      <div className={`mb-4 p-3 border-2 font-inter text-sm flex items-center space-x-2 ${messageStyles[messageType]}`}>
        <MessageIcon />
        <span className="font-mono">{message}</span>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>EXPence App - Terminal Access</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,700|Share+Tech+Mono" />
      </Head>
      <main className={`min-h-screen bg-gray-950 flex items-center justify-center font-inter ${flicker ? 'animate-flicker' : ''}`}>
        <div className={`w-full flex flex-col items-center justify-center transition-all duration-500 ${loading ? 'opacity-0' : 'animate-terminal-on'}`}>
          <div className="screen w-full flex flex-col items-center justify-center">
            <h3 className="title relative mb-3 flex items-center justify-center text-xl uppercase text-purple-700 dark:text-purple-300 font-bold font-inter">
              <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
              <span>&#9608; EXPence App &#9608;</span>
              <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
            </h3>
            <p className="text-xs relative flex items-center justify-center before:h-7 after:h-8 text-amber-500 dark:amber-purple-300">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>
            
            <div className="box--outer mx-auto w-full max-w-3xl border-b-4 border-t-4 border-purple-300 dark:border-purple-700 p-4 flex flex-col items-center justify-center">
              <div className="box w-full text-center uppercase flex flex-col items-center justify-center">
                <div className="box--inner inline-block w-full before:block before:h-7 before:w-full before:bg-center before:bg-no-repeat after:block after:h-7 after:w-full after:bg-center after:bg-no-repeat">
                  <div className="content relative block min-h-[400px] p-5 flex flex-col items-center justify-center">
                    <div className="holder flex flex-col items-center justify-center p-5 w-full">
                      <p className="mb-8 mt-20 sm:mt-0 text-xl font-bold text-purple-700 dark:text-purple-300 font-inter text-center">
                        <span className="mr-2 animate-pulse">WARNING</span> — Access to EXPence System requires credentials
                      </p>

                      {/* Auth Mode Toggle */}
                      <div className="mb-6 flex space-x-1 bg-gray-800 rounded p-1">
                        <button
                          onClick={() => setIsLogin(true)}
                          className={`px-4 py-2 text-sm font-inter uppercase transition ${
                            isLogin 
                              ? 'bg-purple-600 text-white' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          [LOGIN]
                        </button>
                        <button
                          onClick={() => setIsLogin(false)}
                          className={`px-4 py-2 text-sm font-inter uppercase transition ${
                            !isLogin 
                              ? 'bg-purple-600 text-white' 
                              : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          [REGISTER]
                        </button>
                      </div>

                      <MessageDisplay />

                      <form onSubmit={handleEmailLogin} className="w-full max-w-md space-y-5">
                        {/* Email Field */}
                        <div className="flex flex-col sm:flex-row items-center">
                          <div className="mb-2 w-full sm:w-32 text-left after:ml-2 after:content-[':'] sm:mb-0 text-purple-700 dark:text-purple-300 font-inter">
                            Email
                          </div>
                          <div className="w-full">
                            <input 
                              type="email" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-gray-800 p-2 font-inter text-purple-700 dark:text-purple-200 outline-none shadow focus:border-purple-600 transition"
                              placeholder="user@domain.com"
                              required
                              disabled={authLoading}
                            />
                          </div>
                        </div>

                        {/* Username Field (only for registration) */}
                        {!isLogin && (
                          <div className="flex flex-col sm:flex-row items-center">
                            <div className="mb-2 w-full sm:w-32 text-left after:ml-2 after:content-[':'] sm:mb-0 text-purple-700 dark:text-purple-300 font-inter">
                              Username
                            </div>
                            <div className="w-full">
                              <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-gray-800 p-2 font-inter text-purple-700 dark:text-purple-200 outline-none shadow focus:border-purple-600 transition"
                                placeholder="Choose username"
                                maxLength={20}
                                required={!isLogin}
                                disabled={authLoading}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Password Field */}
                        <div className="flex flex-col sm:flex-row items-center">
                          <div className="mb-2 w-full sm:w-32 text-left after:ml-2 after:content-[':'] sm:mb-0 text-purple-700 dark:text-purple-300 font-inter">
                            Password
                          </div>
                          <div className="w-full relative">
                            <input 
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-gray-800 p-2 pr-10 font-inter text-purple-700 dark:text-purple-200 outline-none shadow focus:border-purple-600 transition"
                              placeholder={isLogin ? "Enter password" : "Min 6 characters"}
                              minLength={isLogin ? 1 : 6}
                              required
                              disabled={authLoading}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300 transition"
                              disabled={authLoading}
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                          type="submit"
                          disabled={authLoading}
                          className="mt-5 mb-5 w-full border border-amber-100 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-inter uppercase px-10 py-3 shadow transition text-center"
                        >
                          {authLoading ? (
                            <span className="flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              {isLogin ? 'ACCESSING...' : 'CREATING...'}
                            </span>
                          ) : (
                            `[${isLogin ? 'Enter System' : 'Register User'}]`
                          )}
                        </button>
                      </form>

                      {/* Google Login Button */}
                      <div className="mb-5 flex w-full max-w-md items-center justify-center">
                        <button 
                          onClick={handleGoogleLogin}
                          disabled={authLoading}
                          className="w-full bg-purple-100 dark:bg-purple-900 p-2 font-inter text-purple-700 dark:text-purple-200 shadow hover:bg-purple-200 dark:hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <span className="font-bold">
                            {authLoading ? (
                              <span className="flex items-center justify-center">
                                <div className="w-4 h-4 border-2 border-purple-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                                CONNECTING...
                              </span>
                            ) : (
                              '[ CONNECT WITH GOOGLE ]'
                            )}
                          </span>
                        </button>
                      </div>

                      {/* Security Info */}
                      <div className="mt-4 text-xs text-purple-400 font-inter text-center space-y-1">
                        <p>🔒 SECURE OAUTH 2.0 AUTHENTICATION</p>
                        <p>🛡️ CCPA/GDPR COMPLIANT • SOC 2 TYPE II</p>
                        <p>⚡ AI-POWERED FINANCIAL EDUCATION</p>
                      </div>
                      
                      <p className="text-xs text-amber-500 dark:amber-purple-300 text-center mt-6">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-20 text-center after:mx-auto after:block after:h-7 after:max-w-md after:bg-[url('/bottom-decoration.png')] after:bg-center after:bg-no-repeat">
              <div className="text-xs text-purple-600 dark:text-purple-300 font-inter text-center">
                <span className="animate-blink">&#9608;</span> SYSTEM v2.0 | <span className="animate-pulse">SECURE CONNECTION</span> | POWERED BY SUPABASE
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .animate-terminal-on {
          animation: terminal-on 0.5s ease-out;
        }
        
        .animate-flicker {
          animation: flicker 0.15s ease-in-out;
        }
        
        .animate-blink {
          animation: blink 1s infinite;
        }
        
        @keyframes terminal-on {
          0% {
            opacity: 0;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </>
  );
}