'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../common/page";

export default function ShopsListComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState([]);

  const handleAddNewShop = () => {
    router.push("/components/admin/shop-add-form");
  };

  const handleEdit = (shopId) => {
    router.push(`/components/admin/shop-edit-form?id=${shopId}`);
  };
  const handleSearch = async () => {
  try {
    const res = await fetch(`http://localhost:5000/api/shop/search?name=${encodeURIComponent(searchTerm)}`);
    const data = await res.json();
    setShops(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Search failed:", error);
    setShops([]);
  }
};

  const handleDelete = async (shopId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shop?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/shop/delete/${shopId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShops((prev) => prev.filter((shop) => shop.id !== shopId));
      } else {
        const result = await res.json();
        alert("❌ Delete failed: " + result.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("❌ Something went wrong while deleting.");
    }
  };

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/shop/list");
        const data = await res.json();
        if (Array.isArray(data)) {
          setShops(data);
        } else if (Array.isArray(data.shops)) {
          setShops(data.shops);
        } else {
          console.warn("Unexpected format:", data);
          setShops([]);
        }
      } catch (error) {
        console.error("Error fetching shops:", error);
        setShops([]);
      }
    };

    fetchShops();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-8 p-6">

        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold text-black">Shop List</h1>
          <button
            onClick={handleAddNewShop}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Add New Shop
          </button>
        </div>
            <div className="w-full max-w-6xl flex justify-end mb-4">
  <input
    type="text"
    placeholder="Search by shop name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-800"
  />
  <button
    onClick={handleSearch}
    className="ml-2 px-4 py-1.5 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700"
  >
    Search
  </button>
</div>
        {/* Table Section */}
        <div className="w-full max-w-6xl bg-white rounded shadow p-6 overflow-x-auto">
          {Array.isArray(shops) && shops.length > 0 ? (
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Shop Name</th>
                  <th className="px-4 py-2 border">Owner</th>
                  <th className="px-4 py-2 border">Email</th>
                  <th className="px-4 py-2 border">Location</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{shop.id}</td>
                    <td className="px-4 py-2 border">{shop.name}</td>
                    <td className="px-4 py-2 border">{shop.owner}</td>
                    <td className="px-4 py-2 border">{shop.email}</td>
                    <td className="px-4 py-2 border">{shop.location}</td>
                    <td className="px-4 py-2 border text-center space-x-2">
                      <button
                        onClick={() => handleEdit(shop.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => handleDelete(shop.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No shops found.</p>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}