"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import OwnerLayout from "../../layouts/page";

export default function AddShop() {
  const [ownerName, setOwnerName] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    shopName: "",
    email: "",
    address: "",
    city: "",
    district: "",
    country: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchOwnerName = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/api/owns/test", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("API Response:", data);

        if (res.status === 401) {
          setError("Invalid or expired token");
        } else if (data.status && data.user?.name) {
          setOwnerName(data.user.name);
        } else {
          setError("No owner name found");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("Failed to fetch owner name");
      }
    };

    fetchOwnerName();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setForm({
      shopName: "",
      email: "",
      address: "",
      city: "",
      district: "",
      country: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please login again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:5000/api/owns/add-shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Shop Add Response:", data);

      if (data.status) {
        setShowSuccessPopup(true);
        handleReset();
        
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push("/components/owner/views/dashboard");
        }, 2000);
      } else {
        setError(data.error || "Failed to add shop");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError("Failed to submit shop. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewShops = () => {
    router.push("/components/owner/views/dashboard");
  };

  return (
    <OwnerLayout showSidebar={false}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
              <div className="flex flex-col items-center">
                <div className="bg-green-100 rounded-full p-3 mb-4">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Success!
                </h2>
                <p className="text-gray-600 text-center">
                  Shop added successfully
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Heading */}
          <h1 className="text-2xl font-bold text-center text-black mb-4">
            Add New Shop
          </h1>

          {/* Owner Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Owner Name
            </label>
            <input
              type="text"
              value={ownerName}
              disabled
              className="w-full px-3 py-2 border rounded-md bg-gray-100"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Shop Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Shop Name
            </label>
            <input
              type="text"
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter shop name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter address"
              required
            />
          </div>

          {/* City, District, Country in one row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="City"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                District
              </label>
              <input
                type="text"
                name="district"
                value={form.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="District"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Country"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 text-sm"
                disabled={isSubmitting}
              >
                Reset
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:bg-blue-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>

            <button
              type="button"
              onClick={handleViewShops}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              disabled={isSubmitting}
            >
              View Shops
            </button>
          </div>
        </form>
      </div>
    </OwnerLayout>
  );
}