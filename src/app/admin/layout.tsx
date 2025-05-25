"use client";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state: authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirecionar se não estiver autenticado ou não for admin
    if (!authState.isLoading && (!authState.isAuthenticated || authState.user?.role !== "admin")) {
      router.replace("/login");
    }
  }, [authState.isAuthenticated, authState.isLoading, authState.user?.role, router]);

  // Mostrar loading enquanto verifica autenticação 
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Renderizar layout admin apenas se autenticado e for admin
  if (!authState.isAuthenticated || authState.user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8 pt-24">{children}</main>
      </div>
    </div>
  );
}
