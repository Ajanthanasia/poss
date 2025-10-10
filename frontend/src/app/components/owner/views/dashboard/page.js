"use client";

import { useState, useEffect } from "react";
import OwnerLayout from "../../layouts/page";
import OwnerAsideBar from "../../layouts/aside";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OwnerDashboard() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [ownerId, setOwnerId] = useState(null);

  // Get ownerId only on client
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("user_id");
      setOwnerId(id);
    }
  }, []);

  useEffect(() => {
    if (!ownerId) return;

    const fetchShops = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:5000/api/shop/owner/${ownerId}`
        );
        const data = await res.json();
        setShops(data || []);
      } catch (error) {
        console.error("Failed to fetch shops", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [ownerId]);

  if (loading) {
    return (
      <OwnerLayout>
        <div className="min-h-screen flex justify-center items-center text-gray-600">
          Loading shops...
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">
        <h1 className="text-xl font-bold text-black self-start">
          Hi, Owner — Welcome to our POS System
        </h1>

        {shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 bg-white rounded-lg shadow-md p-10">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              You don’t have any shops yet.
            </p>
            <button
              onClick={() => router.push("/owner/addshop")}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-all"
            >
              ➕ Add Your First Shop
            </button>
          </div>
        ) : (
          <>
            <div className="self-end mb-2">
              <button
                onClick={() => router.push("/owner/addshop")}
                className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-all"
              >
                ➕ Add New Shop
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 w-full">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="flex items-center w-full bg-green-200 border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100"
                >
                  <Image
                    src="/shop.png"
                    alt="shop"
                    width={400}
                    height={300}
                    className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                  />
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {shop.name}
                    </h5>
                    <div className="mb-3 font-normal text-gray-700">
                      <p className="font-semibold text-gray-800 mb-1">Address:</p>
                      <p>{shop.address}</p>
                      <p>
                        {shop.city}, {shop.district}
                      </p>
                      <p>{shop.country}</p>
                      {shop.email && (
                        <p className="mt-2 text-gray-800">
                          <span className="font-semibold">Email:</span> {shop.email}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </OwnerLayout>
  );
}
