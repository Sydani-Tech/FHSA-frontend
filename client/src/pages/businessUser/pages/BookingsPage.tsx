import { useBookings } from "@/hooks/use-bookings";
import { useAssets } from "@/hooks/use-assets";
import { Card, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Loader2, Search, ArrowRight, Hash } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookingList } from "./components/BookingList";

export default function BookingsPage() {
  const { data: bookings, isLoading: isLoadingBookings } = useBookings();
  const { data: assets } = useAssets({});

  if (isLoadingBookings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getAssetDetails = (assetId: number) => {
    return assets?.find((a) => a.id === assetId);
  };

  const getFilteredBookings = (status: string) => {
    if (!bookings) return [];
    if (status === "all") return bookings;
    if (status === "pending")
      return bookings.filter((b) => b.status === "pending");
    if (status === "active")
      return bookings.filter((b) =>
        ["approved", "paid", "in_possession"].includes(b.status),
      );
    if (status === "completed")
      return bookings.filter((b) =>
        ["returned", "completed"].includes(b.status),
      );
    if (status === "cancelled")
      return bookings.filter((b) =>
        ["cancelled", "rejected"].includes(b.status),
      );
    return bookings;
  };

  const renderContent = (status: string) => {
    const filtered = getFilteredBookings(status);

    if (filtered.length === 0) {
      if (status === "all") {
        return (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/30 rounded-2xl border border-dashed border-border mt-8">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold text-foreground">
              No bookings yet
            </h3>
            <p className="text-muted-foreground mt-2 max-w-sm mb-6">
              You haven't booked any assets yet. Browse the marketplace to find
              what you need.
            </p>
            <Link to="/marketplace">
              <Button>Browse Marketplace</Button>
            </Link>
          </div>
        );
      }
      return (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No {status} bookings found.</p>
        </div>
      );
    }

    return <BookingList bookings={filtered} assets={assets || []} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-display text-primary">
          My Bookings
        </h1>
        <p className="text-muted-foreground">
          Track the status of your equipment bookings and usage.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 md:w-auto h-auto">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {renderContent("all")}
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          {renderContent("pending")}
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          {renderContent("active")}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderContent("completed")}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          {renderContent("cancelled")}
        </TabsContent>
      </Tabs>
    </div>
  );
}
