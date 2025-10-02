"use client"

import { useState, useEffect } from 'react';
import OwnerLayout from "../../layouts/page";
import Image from "next/image";


export default function OwnerDashboard() {
    const [shops, setShops] = useState([]);

    const mysets = [
        { id: 1, name: 'west' },
        { id: 1, name: 'White Rice Shop' },
    ];
    useEffect(() => {
        setShops(mysets);
    }, []);

    return (
        <>
            <OwnerLayout>
                <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

                    {/* Header */}
                    <h1 className="text-xl font-bold text-black self-start">
                        <div>Hi, Owner Welcome to our POS System</div>
                    </h1>

                    <div className="grid grid-cols-1 gap-4">
                        {shops.map((item, index) => (
                            <div key={index} className="flex items-center bg-green-200 border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                <Image src='/shop.png' alt="shop" width={400} height={300} className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" />
                                <div className="flex flex-col justify-between p-4 leading-normal">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {item.name ?? ''}
                                    </h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        Address : 1009B/9U
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </OwnerLayout>
        </>
    );
}