import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Settings,
  LogOut,
  Calendar,
} from "lucide-react";

export const adminRoutes = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Assets",
    path: "/admin/assets",
    icon: Package,
  },
  {
    name: "Bookings",
    path: "/admin/bookings",
    icon: Calendar,
  },
  {
    name: "Settings",
    path: "/admin/settings",
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
