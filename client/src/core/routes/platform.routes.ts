import {
  Users,
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  LogOut,
  ShieldCheck
} from "lucide-react";

// Super Admin Routes (Platform Owner)
export const platformRoutes = [
  {
    name: "Overview",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Asset Management",
    path: "/admin/assets", 
    icon: Package,
  },
  {
    name: "Request Queue",
    path: "/admin/requests",
    icon: FileText,
  },
  {
    name: "Platform Settings",
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
