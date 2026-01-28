import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSideBar from "./components/AdminSideBar";
import AdminHeader from "./components/AdminHeader";
import { cn } from "@/core/lib/utils";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300 flex flex-col",
          collapsed ? "ml-16" : "ml-64",
        )}
      >
        <AdminHeader />
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
