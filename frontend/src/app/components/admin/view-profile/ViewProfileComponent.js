'use client'

import AdminLayout from '../common/page';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HiArrowLeft } from 'react-icons/hi';

export default function ViewProfile() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        setMounted(true);

        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${apiUrl}/api/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.success) {
                    setProfile(res.data);
                } else {
                    setError(res.data.message || "Failed to fetch profile");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Server error. Please try again later.");
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(''), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    if (!mounted) return null;

    return (
        <AdminLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="flex flex-col justify-start w-full max-w-md h-auto bg-gray-800 rounded-2xl shadow-xl p-8 relative">
                    
                    {/* Back Arrow */}
                    <div
                        className="absolute top-4 left-4 cursor-pointer text-white hover:text-indigo-400"
                        onClick={() => router.back()}
                    >
                        <HiArrowLeft size={24} />
                    </div>

                    {/* Avatar */}
                    <div className="flex justify-center -mt-4 mb-6">
                        <img
                            src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
                            alt="User Icon"
                            className="w-28 h-28 object-contain rounded-full border-2 border-gray-600"
                        />
                    </div>

                    {/* Header */}
                    <h1 className="text-xl font-semibold text-white text-center mb-6">Profile</h1>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 p-2 text-center rounded bg-rose-500 text-white font-medium w-full animate-fade text-sm">
                            {error}
                        </div>
                    )}

                    {/* Profile Info */}
                    {profile && (
                        <div className="flex flex-col space-y-5">
                            
                            {/* Name */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-100 mb-1">Name</label>
                                <p className="p-3 rounded-md bg-white/5 text-white text-lg">{profile.name}</p>
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-100 mb-1">Email</label>
                                <p className="p-3 rounded-md bg-white/5 text-white text-lg">{profile.email}</p>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
