"use client"
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please provide both new password and confirm password.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        try {
            const response = await axios.post('/api/users/reset-password', {
                token,
                newPassword,
                confirmPassword,
            });

            if (response.data.success) {
                toast.success("Password changed successfully.");
                router.push("/login")
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error)
            toast.error("An error occurred while changing the password.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 shadow-lg rounded-md">
                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
