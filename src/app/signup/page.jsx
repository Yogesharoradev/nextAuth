"use client"
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Signup = () => {

  const [showPassword , setShowPassword] = useState(false)
  const [loading , setLoading ] =useState(false)
  const router = useRouter()

  const [formValues , setFormValues] = useState({
    email : "",
    password : "",
    username : ""
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const userSignUp = async (e)=>{
    try{
      e.preventDefault()
      setLoading(true)
      await axios.post("/api/users/signup" , formValues )
      toast.success("sent you email for verify")
      console.log(formValues)
    }catch(err){
      toast.error(err.message)
    }
   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
        <form className="space-y-4" onSubmit={userSignUp}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              name='username'
              value={formValues.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name='email'
              value={formValues.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className='flex gap-3 items-center'>
            <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
            name='password'
            type={showPassword ? "text" : "password"}
            value={formValues.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            </div>
            <button
             className='py-1 px-2 mt-5 bg-red-400 text-white font-semibold rounded-lg'
             type="button" 
             onClick={() => setShowPassword(!showPassword)}
            >
              {
                showPassword ? "Hide" : "Show"
              }
              </button>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
             {loading ? "ho rha h ..." : "Sign Up"  } 
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
