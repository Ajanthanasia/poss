"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSearchParams } from "next/navigation";
import OwnerLayout from "../layouts/page";
import axios from "axios";

export default function MakeSalesPage() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    const productsUrl = `${apiUrl}api/owns/products-list`;

    const searchParams = useSearchParams();
    const [products, setProducts] = useState([]);

    // Get the id from query string
    const shopId = searchParams.get("shop_id");

    const fetchProducts = async () => {
        const token = localStorage.getItem("token");
        try {
            // get the products list
            const res = await axios.post(
                `${productsUrl}`,
                {
                    shop_id: shopId
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            setProducts(res.data);
        } catch (error) {
            console.log(error);
        }
        // console.log(products);
    };

    useEffect(() => {
        fetchProducts();
    });

    const clickAddToCart = (product) => {
        console.log(product);
    }


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
                        <div>
                            {products?.map((product, index) => (
                                <div key={product?.id} className="bg-sky-300 rounded-lg shadow-md p-2 mb-1 border-sky-900"
                                    onClick={() => clickAddToCart(product)}>
                                    <b>
                                        {index + 1}.
                                        {product?.name} - Unit Price : {product?.price}
                                    </b>
                                </div>
                            ))}
                        </div>
                        <div>
                            bill view
                        </div>
                    </div>
                </div>


            </div>
        </OwnerLayout>
    );
} 