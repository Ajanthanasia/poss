"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import OwnerLayout from "../../layouts/page";
import axios from "axios";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

export default function ProductsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
  const searchParams = useSearchParams();
  const shopId = searchParams.get("shop_id");

  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [form, setForm] = useState({
    shop_id: shopId,
    name: "",
    unit_type: "piece",
    description: "",
    price: "",
    qty: "",
    status_id: 1,
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${apiUrl}api/owns/products-list`,
        { shop_id: shopId },
        { headers: { "Authorization": `Bearer ${token}` } }
      );
      setProducts(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [shopId]);

  // Pagination calculations
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingProduct) {
        await fetch(`${apiUrl}/api/owns/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            qty: parseInt(form.qty),
          }),
        });
      } else {
        await fetch(`${apiUrl}/api/owns/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ...form,
            price: parseFloat(form.price),
            qty: parseInt(form.qty),
          }),
        });
      }
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      shop_id: product.shop_id,
      name: product.name,
      unit_type: product.unit_type,
      description: product.description || "",
      price: product.price,
      qty: product.qty,
      status_id: product.status_id,
      creator_id: product.creator_id,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${apiUrl}/api/owns/products/${id}`, {
          method: "DELETE",
          headers: { "Authorization": `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const resetForm = () => {
    setForm({ shop_id: shopId, name: "", unit_type: "piece", description: "", price: "", qty: "", status_id: 1 });
    setEditingProduct(null);
    setIsFormOpen(false);
  };

  return (
    <OwnerLayout>
      {/* Full height flex column — no page scroll, only table scrolls */}
      <div className="h-full flex flex-col gap-4">

        {/* Top bar */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h1 className="text-2xl font-bold text-black">Products List</h1>
          <Link href={`/components/owner/products/addProduct?shop_id=${shopId}`}>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              + Add Product
            </button>
          </Link>
        </div>

        {/* Inline edit/add form */}
        {isFormOpen && (
          <div className="flex-shrink-0 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-black mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text" required placeholder="Enter product name"
                    value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                  <select
                    value={form.unit_type} onChange={(e) => setForm({ ...form, unit_type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="l">Liter (l)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs.)</label>
                  <input
                    type="number" required step="0.01" placeholder="0.00"
                    value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number" required placeholder="0"
                    value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  placeholder="Enter product description"
                  value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table card — flex-1 so it fills remaining space, overflow-y-auto for inner scroll */}
        <div className="flex-1 bg-white rounded-lg shadow-md flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No products found. Add your first product to get started.
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {product.description || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          {product.unit_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Rs. {parseFloat(product.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleEdit(product)} className="text-blue-600 hover:text-blue-900 mr-4">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination — pinned to bottom of the card */}
          {products.length > 0 && (
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span>
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, products.length)}–{Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                  >
                    {PAGE_SIZE_OPTIONS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1 || totalPages <= 1}
                  className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "..." ? (
                      <span key={`ellipsis-${idx}`} className="px-2">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setCurrentPage(item)}
                        className={`px-3 py-1 rounded ${
                          currentPage === item
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-200"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setCurrentPage(p => p + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </OwnerLayout>
  );
}
