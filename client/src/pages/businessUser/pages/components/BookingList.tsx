import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Calendar, Clock, MapPin, ArrowRight, Hash } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BookingListProps {
  bookings: any[];
  assets: any[];
}

export function BookingList({ bookings, assets }: BookingListProps) {
  const getAssetDetails = (assetId: number) => {
    return assets?.find((a) => a.id === assetId);
  };

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => {
        const asset = getAssetDetails(booking.asset_id);
        return (
          <Card
            key={booking.id}
            className="hover:shadow-md transition-all duration-300 border-black/10"
          >
            <CardHeader className="pb-3 md:pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {asset?.images?.[0] && (
                    <img
                      src={asset.images[0]}
                      alt={asset.name}
                      className="h-12 w-12 rounded-md object-cover hidden sm:block"
                    />
                  )}
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {asset?.name || `Asset #${booking.asset_id}`}
                      <span className="text-xs font-normal text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full">
                        <Hash className="h-3 w-3" /> {booking.reference_code}
                      </span>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> Requested on{" "}
                      {booking.created_at
                        ? format(new Date(booking.created_at), "MMM d, yyyy")
                        : "Unknown Date"}
                    </CardDescription>
                  </div>
                </div>
                <StatusBadge status={booking.status} role="business_user" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" /> Dates
                  </span>
                  <p>
                    {booking.dates.start
                      ? format(new Date(booking.dates.start), "MMM d, yyyy")
                      : "N/A"}{" "}
                    -{" "}
                    {booking.dates.end
                      ? format(new Date(booking.dates.end), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
                {asset && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" /> Location
                    </span>
                    <p>{asset.location}</p>
                  </div>
                )}
                <div className="md:col-span-2 space-y-1 bg-muted/30 p-3 rounded-md">
                  <span className="text-muted-foreground font-medium">
                    Purpose
                  </span>
                  <p className="text-foreground/90">{booking.purpose}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link to={`/bookings/${booking.id}`}>
                  <Button variant="outline" size="sm" className="gap-2">
                    View Details <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
