"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import OwnerLayout from "../layouts/page";
import axios from "axios";

export default function MakeSalesPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const productsUrl = `${apiUrl}api/owns/products-list`;

    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState([]);

    const shopId = searchParams.get("shop_id");

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post(
                `${productsUrl}`,
                { shop_id: shopId },
                { headers: { "Authorization": `Bearer ${token}` } }
            );
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [shopId]);

    const clickAddToCart = (product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const changeQuantity = (productId, delta) => {
        setCartItems((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity + delta }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const grandTotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <OwnerLayout>
            <div className="min-h-screen bg-gray-100 flex flex-col items-start justify-start gap-1 p-1">

                <div className="w-full bg-white rounded-lg shadow-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Order
                            </label>
                        </div>
                    </div>
                </div>

                <div className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">

                        {/* LEFT: Product List */}
                        <div>
                            {products?.map((product, index) => (
                                <div
                                    key={product?.id}
                                    className="bg-sky-300 rounded-lg shadow-md p-2 mb-1 border border-sky-900 cursor-pointer hover:bg-sky-400 active:scale-95 transition-transform"
                                    onClick={() => clickAddToCart(product)}
                                >
                                    <b>
                                        {index + 1}. {product?.name}
                                    </b>
                                    <div className="text-sm text-gray-700">
                                        Unit Price: {product?.price}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: Bill View */}
                        <div className="bg-white rounded-lg shadow-md p-3 flex flex-col">
                            <h2 className="text-lg font-bold mb-3 border-b pb-2">Bill</h2>

                            {cartItems.length === 0 ? (
                                <p className="text-gray-400 text-sm">Click a product to add it to the bill.</p>
                            ) : (
                                <>
                                    <div className="flex-1 overflow-y-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left border-b text-gray-500">
                                                    <th className="pb-2">Product</th>
                                                    <th className="pb-2 text-center">Qty</th>
                                                    <th className="pb-2 text-right">Subtotal</th>
                                                    <th className="pb-2"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item) => (
                                                    <tr key={item.id} className="border-b last:border-0">
                                                        <td className="py-2 font-medium">{item.name}</td>
                                                        <td className="py-2">
                                                            <div className="flex items-center justify-center gap-1">
                                                                <button
                                                                    onClick={() => changeQuantity(item.id, -1)}
                                                                    className="w-6 h-6 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 font-bold"
                                                                >
                                                                    -
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => {
                                                                        const val = parseInt(e.target.value);
                                                                        if (!isNaN(val) && val > 0) {
                                                                            setCartItems((prev) =>
                                                                                prev.map((i) =>
                                                                                    i.id === item.id ? { ...i, quantity: val } : i
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 focus:outline-none focus:border-sky-400"
                                                                />
                                                                <button
                                                                    onClick={() => changeQuantity(item.id, 1)}
                                                                    className="w-6 h-6 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 font-bold"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="py-2 text-right font-medium">
                                                            {(item.price * item.quantity).toFixed(2)}
                                                        </td>
                                                        <td className="py-2 text-right">
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-red-400 hover:text-red-600 text-xs ml-2"
                                                            >
                                                                ✕
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border-t mt-3 pt-3 flex justify-between items-center font-bold text-base">
                                        <span>Total</span>
                                        <span>{grandTotal.toFixed(2)}</span>
                                    </div>

                                    <button
                                        className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg"
                                        onClick={() => alert("Proceed to checkout")}
                                    >
                                        Checkout
                                    </button>
                                </>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </OwnerLayout>
    );
}
