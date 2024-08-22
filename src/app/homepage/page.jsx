"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'


const Homepage = () => {
  const router = useRouter()
  
  const logout =async()=>{
    const res = await axios.get("/api/users/logout")
    toast.success(res.data.message)
      router.push("/login")
  }
  return (
    <div>
      hllo welcome

      <button className='bg-blue-500' onClick={logout}>
        Logout button
      </button>
    </div>
  )
}

export default Homepage
