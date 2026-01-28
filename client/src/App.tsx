import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./core/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/core/provider/AuthProvider";
import ProtectedRoute from "@/core/components/ProtectedRoute";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/businessUser/pages/Dashboard";
import AssetsList from "@/pages/businessUser/pages/AssetsList";
import AssetDetail from "@/pages/businessUser/pages/AssetDetail";
import AdminOverview from "@/pages/admin/pages/AdminOverview";
import AdminUsers from "@/pages/admin/pages/AdminUsers";
import AdminAssets from "@/pages/admin/pages/AdminAssets";
import AdminBookings from "@/pages/admin/pages/AdminBookings";
import AdminLayout from "@/pages/admin/AdminLayout";
import ProfilePage from "@/pages/businessUser/pages/ProfilePage";
import BookingsPage from "@/pages/businessUser/pages/BookingsPage";
import BookingDetailPage from "@/pages/businessUser/pages/BookingDetailPage";
import CreateAssetPage from "@/pages/admin/pages/CreateAssetPage";
import AdminAssetDetail from "@/pages/admin/pages/AdminAssetDetail";

import DashboardLayout from "@/pages/businessUser/DashboardLayout";
import { ThemeProvider } from "@/components/theme-provider";
import AdminBookingDetail from "./pages/admin/pages/AdminBookingDetail";
import AdminUserDetail from "@/pages/admin/pages/AdminUserDetail";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/auth/register" element={<Register />} />

      {/* Business User Routes */}
      <Route element={<ProtectedRoute allowedRoles={["business_user"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<AssetsList />} />
          <Route path="/marketplace/:id" element={<AssetDetail />} />

          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />

          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Admin Dashboard */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {" "}
          {/* Parent route for AdminLayout */}
          <Route index element={<AdminOverview />} />{" "}
          {/* AdminOverview as index route */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<AdminUserDetail />} />{" "}
          {/* Added route */}
          <Route path="assets" element={<AdminAssets />} />
          <Route path="assets/new" element={<CreateAssetPage />} />
          <Route path="assets/:id" element={<AdminAssetDetail />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="bookings/:id" element={<AdminBookingDetail />} />
        </Route>
      </Route>

      {/* Shared Protected Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Other shared routes if any */}
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Toaster />
          <AuthProvider>
            <BrowserRouter>
              <Router />
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
