"use client";

import React from "react";
import ShopPage from "../../../components/owner/shop/ShopPage"; // default export

export default function Page({ params: paramsPromise }) {
  const params = React.use(paramsPromise); // unwrap Next.js 15 params
  return <ShopPage shopId={params.shopid} />;
}
