"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import OwnerLayout from "../layouts/page";
import axios from "axios";

export default function MakeSalesPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const searchParams = useSearchParams();

    // Get the id from query string
    const shopId = searchParams.get("shop_id");

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-100 flex flex-col items-start justify-start gap-1 p-1">
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-black">New Sale</h1>
                </div>

                <div className="w-full bg-white rounded-lg shadow-md p-4">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Add to cart
                            </label>
                        </div>
                    </div>

                </div>


            </div>
        </OwnerLayout>
    );
} 