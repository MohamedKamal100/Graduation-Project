import React, { useEffect, useState } from 'react';

export default function NotFound() {
  const [counter, setCounter] = useState(5);

  useEffect(() => {
    const countdown = setInterval(() => {
      setCounter(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (counter === 0) {
      window.location.href = '/';
    }
  }, [counter]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-green-600 mb-4 animate-bounce">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you are looking for does not exist or has been moved.</p>
      <p className="text-gray-500 mb-8">Redirecting to home in {counter} seconds...</p>
      <a
        href="/"
        className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-all duration-300"
      >
        Go to Home
      </a>
    </div>
  );
}
