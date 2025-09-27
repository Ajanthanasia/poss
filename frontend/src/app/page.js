"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./components/login/page";
import AdminDashboard from "./components/admin/dashboard/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const apiToken = localStorage.getItem('token');
    if (apiToken) {
      router.push('/components/admin/dashboard');
    } else {
      router.push('/components/login');
    }
  }, []); // add empty dependency array to run once

  return null; // or a loading spinner if you prefer
}
