'use client';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminSidebar from "../sidebar/page";
import AdminHeader from "../header/page";

export default function ShopEditForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shopId = searchParams.get("id");

  const [form, setForm] = useState({
    owner_id: "",
    name: "",
    email: "",
    address: "",
    city: "",
    district: "",
    country: "",
  });

  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopRes, ownersRes] = await Promise.all([
          fetch(`http://localhost:5000/api/shop/${shopId}`),
          fetch("http://localhost:5000/api/shop/owners"),
        ]);

        const shopData = await shopRes.json();
        const ownersData = await ownersRes.json();

        setForm(shopData);
        setOwners(ownersData);
        setLoading(false);
      } catch (err) {
        console.error("Error loading data:", err);
        setLoading(false);
      }
    };

    if (shopId) fetchData();
  }, [shopId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/shop/update/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();
      if (res.ok) {
        setSuccessMessage("✅ Shop updated successfully!");
        setTimeout(() => {
          router.push("/components/admin/shops/index");
        }, 2000);
      } else {
        alert("❌ Error: " + result.error);
      }
    } catch (err) {
      console.error("Update failed:", err);
      alert("❌ Failed to update shop.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-sm">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Edit Shop
            </h2>

            {successMessage && (
              <div className="mb-4 p-3 rounded-md bg-green-100 border border-green-400 text-green-800 text-sm font-medium text-center shadow-sm">
                {successMessage}
              </div>
            )}

            {loading ? (
              <p className="text-center text-gray-500">Loading shop data...</p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Owner Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Select Owner
                  </label>
                  <select
                    name="owner_id"
                    value={form.owner_id}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
                  >
                    <option value="">-- Select Owner --</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Other Fields */}
                {["name", "email", "address", "city", "district", "country"].map((field) => (
                  <div key={field}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
  type="text"
  name={field}
  value={form[field] ?? ""}
  onChange={handleChange}
  placeholder={`Enter ${field}`}
  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-800 text-sm"
/>
                  </div>
                ))}

                {/* Buttons */}
                <div className="flex justify-between items-center pt-3">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-700 transition text-sm"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/components/admin/shops/index")}
                    className="px-4 py-1.5 rounded-md bg-green-500 hover:bg-green-600 text-white font-bold transition text-sm"
                  >
                    Back to List
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}