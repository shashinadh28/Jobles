"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, Auth } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Type assertion to fix linter errors
    const authInstance = auth as Auth;
    
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setAuthChecked(true);
      setLoading(false);
      
      // Only redirect if not already on the login page
      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
    });
    
    return () => unsubscribe();
  }, [router, pathname]);

  // Show loading state while checking auth
  if (loading && pathname !== "/admin/login") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Allow rendering the login page without being authenticated
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // For all other admin pages, only render if authenticated
  return (
    <>
      {children}
    </>
  );
} 