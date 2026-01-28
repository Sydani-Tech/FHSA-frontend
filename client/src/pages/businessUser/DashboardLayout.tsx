import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import BusinessUserSideBar from "./component/SideBar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/core/lib/utils";

export default function DashboardLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <BusinessUserSideBar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className={cn(
          "p-8 min-h-screen transition-all duration-300",
          collapsed ? "ml-16" : "ml-64",
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
