import Dashboard from "@/pages/businessUser/pages/Dashboard";
import AssetDetail from "@/pages/businessUser/pages/AssetDetail";
import AdminOverview from "@/pages/admin/pages/AdminOverview";

export const protectedRoutes = [
  {
    path: "/dashboard",
    element: Dashboard,
    name: "User Dashboard",
    role: "business_user", // or 'any' if not strictly checked here
  },
  {
    path: "/assets/:id",
    element: AssetDetail,
    name: "Asset Detail",
    role: "any", 
  },
  // Re-using AdminDashboard here for the main admin entry, routes specific to admin sidebar loaded inside
  {
    path: "/admin",
    element: AdminOverview,
    name: "Admin Dashboard",
    role: "admin",
  }
];
