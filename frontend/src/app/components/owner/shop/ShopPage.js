// src/components/owner/shop/ShopPage.js
'use client';

import React from "react";
import OwnerLayout from "../layouts/page"; // adjust path if needed
import { useParams } from "next/navigation";

export default function ShopPage({ params }) {
  // const params = useParams();
  const id = params;
  console.log(id);
  return (
    <OwnerLayout>
      {/* The layout already contains header + sidebar */}
      <div className="min-h-screen bg-gray-100 flex flex-col items-start justify-start gap-6 p-6">
        {/* Optionally, you can leave a placeholder text */}
        <h1 className="text-xl font-bold text-black">
          Welcome, Owner
        </h1>
      </div>
    </OwnerLayout>
  );
}
