'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "../../common/page";
import { EyeIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import axios from "axios";

export default function ShopsListComponent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 5; 

  const handleAddNewShop = () => {
    router.push("/components/admin/shop-add-form");
  };

  const handleEdit = (shopId) => {
    router.push(`/components/admin/shop-edit-form?id=${shopId}`);
  };

  const handleSearch = async (pageNum = 1) => {
  try {
    const res = await fetch(`http://localhost:5000/api/shop/search?name=${encodeURIComponent(searchTerm)}&page=${pageNum}&per_page=${perPage}`);
    const data = await res.json();
    if (data.status) {
      setShops(data.data);
      setPage(data.page);
      setPages(data.pages);
      setTotal(data.total);
    } else {
      setShops([]);
    }
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

  const handleView = (shop) => {
    setSelectedShop(shop);
    setIsViewModalOpen(true);
  };

  const handleAccept = async () => {
    if (!selectedShop) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/shop/update-status/${selectedShop.id}`);
      
      if (res.data.status) {
        // Update the shop in the list
        setShops((prev) =>
          prev.map((shop) =>
            shop.id === selectedShop.id ? { ...shop, status_id: 2 } : shop
          )
        );
        
        // Update selected shop
        setSelectedShop({ ...selectedShop, status_id: 2 });
        
        alert("✅ Shop accepted successfully!");
      } else {
        alert("❌ Failed to accept shop: " + res.data.error);
      }
    } catch (error) {
      console.error("Accept error:", error);
      alert("❌ Something went wrong while accepting.");
    }
  };

  const handleReject = () => {
    const confirmReject = window.confirm("Are you sure you want to reject this shop?");
    if (confirmReject) {
      // You can implement reject logic here (e.g., delete or set status to rejected)
      alert("❌ Shop rejected");
      setIsViewModalOpen(false);
    }
  };

  const fetchShops = async (pageNum = 1) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/shop/list?page=${pageNum}&per_page=${perPage}`);
    if (res.data.status) {
      setShops(res.data.data);
      setPage(res.data.page);
      setPages(res.data.pages);
      setTotal(res.data.total);
    }
  } catch (error) {
    console.error("Error fetching shops:", error);
    setShops([]);
  }
};

    useEffect(() => {
  fetchShops(page);
}, [page]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start gap-6 p-6">

        {/* Header */}
        <div className="w-full flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-black">Shop List</h1>
          <button
            onClick={handleAddNewShop}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Add New Shop
          </button>
        </div>

        {/* Search */}
        <div className="w-full max-w-6xl flex justify-start mb-4">
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
                  <th className="px-4 py-2 border">Address</th>
                  <th className="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-center">{shop.id}</td>
                    <td className="px-4 py-2 border">{shop.name}</td>
                    <td className="px-4 py-2 border">{shop.owner.name ?? ''}</td>
                    <td className="px-4 py-2 border">{shop.email}</td>
                    <td className="px-4 py-2 border">{shop.address}</td>
                    <td className="px-4 py-2 border text-center">
                      <div className="flex justify-center items-center gap-3">
                        <button
                          onClick={() => handleView(shop)}
                          title="View"
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(shop.id)}
                          title="Edit"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(shop.id)}
                          title="Delete"
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          ) : (
            <p className="text-gray-500">No shops found.</p>
          )}
        </div>{/* Pagination controls */}
<div className="flex justify-between items-center mt-4">
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
  >
    Prev
  </button>
  <span>Page {page} of {pages} (Total: {total})</span>
  <button
    disabled={page === pages}
    onClick={() => setPage(page + 1)}
    className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50"
  >
    Next
  </button>
</div>

        {/* View Modal */}
        {isViewModalOpen && selectedShop?.id && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
              <h2 className="text-xl font-semibold mb-4">Shop Details</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>ID:</strong> {selectedShop.id}</p>
                <p><strong>Name:</strong> {selectedShop.name}</p>
                <p><strong>Owner:</strong> {selectedShop.owner?.name || "Unknown"}</p>
                <p><strong>Email:</strong> {selectedShop.email}</p>
                <p><strong>Address:</strong> {selectedShop.address}</p>
                <p><strong>City:</strong> {selectedShop.city}</p>
                <p><strong>District:</strong> {selectedShop.district}</p>
                <p><strong>Country:</strong> {selectedShop.country}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedShop.status_id === 2 ? (
                    <span className="text-green-600 font-semibold">Active</span>
                  ) : selectedShop.status_id === 1 ? (
                    <span className="text-yellow-600 font-semibold">Pending</span>
                  ) : (
                    <span className="text-gray-600">Unknown</span>
                  )}
                </p>

                {selectedShop.status_id === 1 && (
                  <div className="mt-6 flex justify-center gap-4">
                    <button
                      className="px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium"
                      onClick={handleAccept}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
                      onClick={handleReject}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}