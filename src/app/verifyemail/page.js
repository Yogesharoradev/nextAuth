"use client";
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      verifyUserEmail(urlToken);
    } else {
      setError(true);
    }
  }, [searchParams]);

  const verifyUserEmail = async (token) => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      toast.success("Email verified successfully!");
    } catch (err) {
      setError(true);
      toast.error("Verification failed. Please try again.");
      console.error(err.response?.data);
    }
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          {verified ? "Email Verified" : error ? "Verification Failed" : "Verifying Email..."}
        </h1>
        <p className="text-center text-gray-600">
          {verified ? "Your email has been successfully verified." : error ? "There was an issue verifying your email. Please try again." : "Please wait while we verify your email."}
        </p>
        {error && (
          <button
            onClick={() => verifyUserEmail(token)}
            className="mt-4 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Retry Verification
          </button>
        )}
        {verified && (
          <button
            onClick={goToLogin}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
