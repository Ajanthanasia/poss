'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL; // your API base URL
    const loginUrl = 'api/login'; // endpoint path

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false); // ✅ loading state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true); // start loading

        try {
            const res = await axios.post(`${apiUrl}${loginUrl}`, {
                email,
                password,
            });

            if (res.data.status === true) {
                localStorage.setItem("token", res.data.api_token);
                setSuccess(res.data.message || 'Login successful!'); // show only final success
                setTimeout(() => {
                    location.reload(); // or redirect to a specific page
                }, 2000);
            } else {
                setError('Invalid email or password.'); // generic error
            }
        } catch (err) {
            console.log(err);
            setError('Invalid email or password.'); // generic error
        } finally {
            setLoading(false); // stop loading
        }
    };

    // Auto hide popup after 3 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                />
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                {/* Popup Messages */}
                {error && (
                    <div className="mb-4 p-3 text-center rounded bg-rose-500 text-white font-medium animate-fade w-11/12 mx-auto">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-3 text-center rounded bg-indigo-500 text-white font-medium animate-fade w-11/12 mx-auto">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-100"
                        >
                            Email address
                        </label>
                        <div className="mt-1">
                            <input
                                type="email"
                                name="email"
                                id="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-100"
                        >
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading} // ✅ disable button while loading
                            className={`w-full flex justify-center rounded-md px-3 py-2 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500
                                ${loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-400'}`}
                        >
                            {loading ? 'Signing in...' : 'Sign in'} {/* button text changes while loading */}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Not a member?{' '}
                    <a
                        href="#"
                        className="font-semibold text-indigo-400 hover:text-indigo-300"
                    >
                        Start a 14 day free trial
                    </a>
                </p>
            </div>
        </div>
    );
}
