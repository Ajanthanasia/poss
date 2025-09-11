'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';

export default function ProfileForm() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        const storedUserEmail = localStorage.getItem('user_email');
        if (storedUserId) setUserId(storedUserId);
        if (storedUserEmail) {
            setUserEmail(storedUserEmail);
            setEmail(storedUserEmail); // pre-fill email
        }
    }, []);

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!email || !currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all the fields.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        if (!userId) {
            setError("User not found. Please login again.");
            return;
        }

        try {
            const token = localStorage.getItem('token');

            const res = await axios.post(
                `${apiUrl}/api/profile/update`,
                {
                    user_id: userId,
                    email,
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.success) {
                setMessage(res.data.message);
                setEmail(userEmail); // reset to current email
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                if (res.data.message?.toLowerCase().includes("current password")) {
                    setError("Oops! Your current password is incorrect.");
                } else if (res.data.message?.toLowerCase().includes("email")) {
                    setError("The email you entered is invalid or already in use.");
                } else {
                    setError(res.data.message || "Something went wrong.");
                }
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Server error. Please try again later.");
        }
    };

    // Auto hide popup after 3 seconds
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError('');
                setMessage('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, message]);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="flex flex-col justify-between w-full max-w-md h-[90vh] bg-gray-800 rounded-2xl shadow-xl p-6 relative">
{/* Back Arrow */}
<div 
    className="absolute top-4 left-4 cursor-pointer text-white hover:text-indigo-400"
    onClick={() => router.back()}

>
    <HiArrowLeft size={24} />
</div>


                {/* Avatar */}
                <div className="flex justify-center -mt-4">
                    <img
                        src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                        alt="User Icon"
                        className="w-28 h-28 object-contain rounded-full border-2 border-gray-600"
                    />
                </div>

                {/* Header */}
                <h1 className="text-lg font-semibold text-white text-center my-3">Edit Profile</h1>

                {/* Popup Messages */}
                {error && (
                    <div className="mb-3 p-2 text-center rounded bg-rose-500 text-white font-medium w-full animate-fade text-sm">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-3 p-2 text-center rounded bg-indigo-500 text-white font-medium w-full animate-fade text-sm">
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full space-y-3">

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-100 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your current email"
                            className="p-2 rounded-md bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-100 mb-1">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="p-2 rounded-md bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-100 mb-1">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="p-2 rounded-md bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-sm font-medium text-gray-100 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="p-2 rounded-md bg-white/5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
}
