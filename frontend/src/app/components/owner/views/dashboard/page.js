"use client";

import { useState, useEffect } from "react";
import OwnerLayout from "../../layouts/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OwnerDashboard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = `${baseUrl}api/owns/shops`;
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [ownerId, setOwnerId] = useState(null);


  // Get ownerId from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("user_id");
      if (id) setOwnerId(parseInt(id)); // convert to number
    }
  }, []);

  // Fetch shops whenever ownerId is ready
  useEffect(() => {
    if (!ownerId) return;
    const token = localStorage.getItem("token");
    console.log(token);

    const fetchShops = async () => {
      try {
        // use to get the shops by login user access_token
        const res = await axios.get(`${apiUrl}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data;
        console.log(data);
        setShops(data || []);
      } catch (error) {
        console.error("Failed to fetch shops", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [ownerId]);

  const handleShopClick = (shop) => {
    console.log(shop);
    if (shop.status_id === 2) {
      router.push(`/components/owner/products/list?id=${shop.id}`);
    } else {
      alert("This shop is not active yet.");
    }
  };

  // Loading state
  if (loading) {
    return (
      <OwnerLayout showSidebar={false}>
        <div className="min-h-screen flex justify-center items-center text-gray-600">
          Loading shops...
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout showSidebar={false}>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-start gap-8 p-6">
        {/* Header with button on right */}
        <div className="w-full">
          <button
            onClick={() => router.push("/components/owner/views/addShop")}
            className="px-5 py-2 bg-green-700 text-white font-medium rounded-lg shadow hover:bg-green-800 transition-all float-right"
          >
            ➕ Add Shop
          </button>
        </div>

        {shops.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 bg-white rounded-lg shadow-md p-10">
            <p className="text-lg font-semibold text-gray-700 mb-4">
              You don’t have any shops yet.
            </p>
            <button
              onClick={() => router.push("/components/owner/views/addShop")}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-all"
            >
              ➕ Add Your First Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 w-full">
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop)}
                className="flex items-center w-full bg-green-200 border border-gray-200 rounded-lg shadow-sm md:flex-row hover:bg-gray-100 cursor-pointer"
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
                    {shop.name} {shop.status_id !== 2 && "(Inactive)"}
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
        )}
      </div>
    </OwnerLayout>
  );
}