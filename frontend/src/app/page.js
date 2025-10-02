"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginPage from "./components/login/page";
import AdminDashboard from "./components/admin/dashboard/page";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const apiToken = localStorage.getItem('token');
    const roleId = parseInt(localStorage.getItem('role_id') || "0", 10);
    console.log('Role id : ', roleId);
    if (apiToken) {
      if (roleId == 1) {
        router.push('/components/admin/dashboard');
      } else if (roleId == 2) {
        router.push('/components/owner/views/dashboard');
      } else {
        router.push('/components/login');
      }
    } else {
      router.push('/components/login');
    }
  }, []); // add empty dependency array to run once

  return null; // or a loading spinner if you prefer
}
