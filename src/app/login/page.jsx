"use client";
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Modal from '../components/modal';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const userLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/users/login", {email : formValues.email , password : formValues.password});
      console.log(res)
      if (res.data.status === 200) {
        toast.success("Login Successful");
        router.push("/homepage");
      } else {
        toast.error(res.data.error || "Login failed 1");
        throw new Error(res.data.error || "Login failed 3");
    }
    } catch (err) {
        toast.error("An error occurred during login. Please try again.");
        console.error(err); // Log the error for debugging purposes
    } finally {
        setLoading(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = async () => {
   
    if (!formValues.email) {
      toast.error("Please enter your email first.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.post("/api/send-reset-email", { email: formValues.email });
  
      if (response.data.message) {
        toast.success("Reset email sent successfully");
        closeModal();
      } else {
        toast.error("Failed to send reset email. Please try again.");
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to send! reset email.");
      } else if (err.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Log In</h1>
        <form className="space-y-4" onSubmit={userLogin}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formValues.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              className="py-1 px-2 mt-5 bg-red-400 text-white font-semibold rounded-lg"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-indigo-600 hover:underline cursor-pointer" onClick={openModal}>
              Forgot Password?
            </span>
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={handleConfirm} />

      <Toaster />
    </div>
  );
};

export default Login;
