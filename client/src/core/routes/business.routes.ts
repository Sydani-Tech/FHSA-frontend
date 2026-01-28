import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  LogOut,
  Search,
  Calendar,
} from "lucide-react";

// Business User Routes (e.g. Farm Owner)
export const businessRoutes = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Marketplace",
    path: "/marketplace",
    icon: Search,
  },

  {
    name: "Bookings",
    path: "/bookings",
    icon: Calendar,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: Settings,
    section: "secondary",
  },
  {
    name: "Logout",
    path: "/auth/logout",
    icon: LogOut,
    section: "secondary",
  },
];
