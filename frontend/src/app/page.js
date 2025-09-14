"use client"
import Image from "next/image";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/page";

import AdminDashboard from "./components/admin/dashboard/page";
import OwnersList from "./components/admin/owners/page";


export default function Home() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const apiToken = localStorage.getItem('token');
    setToken(apiToken);
  });

  return (
    <>
      <BrowserRouter>
        <Routes>
          {token == null ?
            <Route path="/" element={<LoginPage />}></Route>
            :
            <>
              <Route path="/" element={<AdminDashboard />}></Route>
            </>
          }
        </Routes>
      </BrowserRouter>
    </>
  );
}
