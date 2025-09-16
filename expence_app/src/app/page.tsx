//main app page.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [flicker, setFlicker] = useState(false);
  const [username, setUsername] = useState('GUEST');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    const flickerInterval = setInterval(() => {
      setFlicker(prev => !prev);
    }, 4000);
    return () => {
      clearTimeout(timer);
      clearInterval(flickerInterval);
    };
  }, []);

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
    window.location.href = '/dashboard';
  };

  return (
    <>
      <Head>
        <title>Expence App - Terminal Access</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Inter:400,700|Share+Tech+Mono" />
      </Head>
      <main className={`min-h-screen bg-gray-950 flex items-center justify-center font-inter ${flicker ? 'animate-flicker' : ''}`}>
        <div className={`w-full flex flex-col items-center justify-center transition-all duration-500 ${loading ? 'opacity-0' : 'animate-terminal-on'}`}>
          <div className="screen w-full flex flex-col items-center justify-center">
            <h3 className="title relative mb-3 flex items-center justify-center text-xl uppercase text-purple-700 dark:text-purple-300 font-bold font-inter">
              <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
              <span>&#9608; Expence App &#9608;</span>
              <span className="mx-2 hidden sm:inline-block h-5 w-16 md:w-36 bg-[url('/line-decoration.png')]"></span>
            </h3>
            <p className="text-xs relative flex items-center justify-center before:h-7 after:h-8 text-amber-500 dark:amber-purple-300">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>
            
            <div className="box--outer mx-auto w-full max-w-3xl border-b-4 border-t-4 border-purple-300 dark:border-purple-700 p-4 flex flex-col items-center justify-center">
              <div className="box w-full text-center uppercase flex flex-col items-center justify-center">
                <div className="box--inner inline-block w-full before:block before:h-7 before:w-full before:bg-center before:bg-no-repeat after:block after:h-7 after:w-full after:bg-center after:bg-no-repeat">
                  <div className="content relative block min-h-[300px] p-5 flex flex-col items-center justify-center">
                    <div className="holder flex flex-col items-center justify-center p-5 w-full">
                      <p className="mb-8 mt-20 sm:mt-0 text-xl font-bold text-purple-700 dark:text-purple-300 font-inter text-center">
                        <span className="mr-2 animate-pulse">WARNING</span> — Access to Expence System requires credentials
                      </p>
                      
                      <div className="mb-5 flex w-full max-w-md flex-col items-center justify-center sm:flex-row">
                        <div className="mb-2 w-32 text-left after:ml-2 after:content-[':'] sm:mb-0 text-purple-700 dark:text-purple-300 font-inter">
                          Login
                        </div>
                        <div className="w-full">
                          <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-gray-800 p-2 font-inter text-purple-700 dark:text-purple-200 outline-none shadow focus:border-purple-600 transition"
                            maxLength={32}
                          />
                        </div>
                      </div>
                      
                      <div className="mb-5 flex w-full max-w-md flex-col items-center justify-center sm:flex-row">
                        <div className="mb-2 w-32 text-left after:ml-2 after:content-[':'] sm:mb-0 text-purple-700 dark:text-purple-300 font-inter">
                          Password
                        </div>
                        <div className="w-full">
                          <input 
                            type="password" 
                            className="w-full  border-2 border-purple-400 dark:border-purple-600 bg-white dark:bg-gray-800 p-2 font-inter text-purple-700 dark:text-purple-200 outline-none shadow focus:border-purple-600 transition"
                            placeholder=""
                            maxLength={32}
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      <Link 
                        href="/dashboard" 
                        className="mt-5 mb-5 border border-amber-100 bg-purple-600 hover:bg-purple-700 text-white font-inter uppercase px-10 py-3  shadow transition text-center"
                      >
                        [Enter System]
                      </Link>

                      {/* Google Login Button */}
                      <div className="mb-5 flex w-full max-w-md items-center justify-center">
                        <button 
                          onClick={handleGoogleLogin}
                          className="w-full bg-purple-100 dark:bg-purple-900 p-2 font-inter text-purple-700 dark:text-purple-200  shadow hover:bg-purple-200 dark:hover:bg-purple-800 transition"
                        >
                          <span className="font-bold">[ CONNECT WITH GOOGLE ]</span>
                        </button>
                      </div>
                      
                      <p className="text-xs text-amber-500 dark:amber-purple-300 text-center">&#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608; &#9608;</p>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <br />
            
            <div className="mt-20 text-center after:mx-auto after:block after:h-7 after:max-w-md after:bg-[url('/bottom-decoration.png')] after:bg-center after:bg-no-repeat">
              <div className="text-xs text-purple-600 dark:text-purple-300 font-inter text-center">
                <span className="animate-blink">&#9608;</span> SYSTEM v1.0 | <span className="animate-pulse">SECURE CONNECTION</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}