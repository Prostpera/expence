'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [username, setUsername] = useState('GUEST');
  
  // Terminal boot sequence effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    // Flicker effect
    const flickerInterval = setInterval(() => {
      setFlicker(prev => !prev);
    }, 4000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(flickerInterval);
    };
  }, []);

  // Google login handler (for the future)
  const handleGoogleLogin = () => {
    // This would normally connect to Google OAuth
    console.log('Google login initiated');
    // For demo purposes, go to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <>
      <Head>
        <title>Expence App - Terminal Access</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Share+Tech+Mono" />
      </Head>
      <main className={`terminal-theme min-h-screen bg-black font-mono text-[#39FF14] selection:bg-black ${flicker ? 'animate-flicker' : ''}`}>
      <div className={`container mx-auto pt-10 transition-all duration-500 ${loading ? 'opacity-0' : 'animate-terminal-on'}`}>
        <div className="screen">
        <h3 className="title relative mb-3 flex items-center justify-center text-xl uppercase">
        <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
        <span>&#9608; Expence App &#9608;</span>
        <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
      </h3>
      <p className="text-xs relative flex items-center justify-center before:h-7 after:h-8">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>

          
          <div className="box--outer mx-auto w-11/12 max-w-3xl border-b-4 border-t-4 border-[#000] p-4">
            <div className="box w-full text-center uppercase">
              <div className="box--inner inline-block w-full before:block before:h-7 before:w-full')] before:bg-center before:bg-no-repeat after:block after:h-7 after:w-full after:bg-center after:bg-no-repeat">
                <div className="content relative block min-h-[300px] p-5">
                  <div className="holder absolute inset-0 flex flex-col items-center justify-center p-5">
                    
                    <p className="mb-8 mt-20 sm:mt-0 text-xl font-bold">
                      <span className="mr-2 animate-pulse">WARNING</span> — Access to Expence System requires credentials
                    </p>
                    
                    <div className="mb-5 flex w-full max-w-md flex-col items-start sm:flex-row">
                      <div className="mb-2 w-32 text-left after:ml-2 after:content-[':'] sm:mb-0">
                        Login
                      </div>
                      <div className="w-full">
                        <input 
                          type="text" 
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="w-full border-2 border-[#39FF14] bg-transparent p-2 font-mono text-inherit outline-none selection:bg-black"
                          maxLength={32}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-5 flex w-full max-w-md flex-col items-start sm:flex-row">
                      <div className="mb-2 w-32 text-left after:ml-2 after:content-[':'] sm:mb-0">
                        Password
                      </div>
                      <div className="w-full">
                        <input 
                          type="password" 
                          className="w-full border-2 border-[#39FF14] bg-transparent p-2 font-mono text-inherit outline-none selection:bg-black"
                          placeholder=""
                          maxLength={32}
                          autoComplete="off"
                        />
                      </div>
                    </div>

                    <Link 
                      href="/dashboard" 
                      className="mt-5 border-none bg-[#39FF14] bg-opacity-20 px-10 py-3 font-mono uppercase text-[#39FF14] hover:bg-[#39FF14] hover:bg-opacity-30"
                    >
                      [Enter System]
                    </Link>

                    {/* Google Login Button */}
                    <div className="mb-5 flex w-full max-w-md">
                      <button 
                        onClick={handleGoogleLogin}
                        className="w-full bg-transparent p-2 font-mono text-[#39FF14] hover:text-white"
                      >
                        <span className="font-bold">[ CONNECT WITH GOOGLE ]</span>
                      </button>
                    </div>
                    
                    <p className="text-xs">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>
                    <br></br>
                    
                    

                  </div>
                </div>
              </div>
            </div>
          </div>

          <br></br>
          
          <div className="mt-20 text-center after:mx-auto after:block after:h-7 after:max-w-md after:bg-[url('/bottom-decoration.png')] after:bg-center after:bg-no-repeat">
            <div className="text-xs text-green-500">
              <span className="animate-blink">&#9608;</span> SYSTEM v1.0 | <span className="animate-pulse">SECURE CONNECTION</span>
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}