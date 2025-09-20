"use client"
import { useEffect, useState } from "react";
import LoginPage from "./components/login/page";
import AdminDashboard from "./components/admin/dashboard/page";

export default function Home() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const apiToken = localStorage.getItem('token');
    setToken(apiToken);
  }, []); // add empty dependency array to run once

  return (
    <>
      {token == null ? (
        <LoginPage />
      ) : (
        <AdminDashboard />
      )}
    </>
  );
}
