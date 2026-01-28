import { useParams, Link } from "react-router-dom";
import { useBooking } from "@/hooks/use-bookings";
import { useAsset } from "@/hooks/use-assets";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  MapPin,
  ArrowLeft,
  Clock,
  Info,
} from "lucide-react";
import { format } from "date-fns";

export default function RequestDetailPage() {
  const { id } = useParams();
  const requestId = Number(id);

  const {
    data: request,
    isLoading: isLoadingRequest,
    error,
  } = useBooking(requestId);

  // We fetch asset details using the asset_id from the request
  const assetId = request?.asset_id;
  const { data: asset, isLoading: isLoadingAsset } = useAsset(assetId || 0);

  if (isLoadingRequest || (assetId && isLoadingAsset)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Request not found</h2>
        <Link to="/requests">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "in_possession":
      case "returned":
        return "bg-green-500/15 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-500/15 text-red-700 border-red-200";
      case "overdue":
        return "bg-red-500/15 text-red-700 border-red-200";
      case "awaiting_payment":
        return "bg-orange-500/15 text-orange-700 border-orange-200";
      default:
        return "bg-yellow-500/15 text-yellow-700 border-yellow-200";
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/requests">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-primary">
            Request Details
          </h1>
          <p className="text-muted-foreground text-sm">ID: #{request.id}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="secondary" className={getStatusColor(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Start Date
                  </span>
                  <p className="font-medium text-lg">
                    {request.dates?.start
                      ? format(new Date(request.dates.start), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> End Date
                  </span>
                  <p className="font-medium text-lg">
                    {request.dates?.end
                      ? format(new Date(request.dates.end), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Purpose of Request
                </span>
                <div className="bg-muted/30 p-4 rounded-lg text-foreground/90 leading-relaxed">
                  {request.purpose}
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Requested on
                </span>
                <span>
                  {request.created_at
                    ? format(new Date(request.created_at), "PPP p")
                    : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Asset Snapshot */}
        <div className="space-y-6">
          <Card className="border-black/10">
            {asset?.images?.[0] && (
              <div className="h-32 w-full overflow-hidden rounded-t-xl">
                <img
                  src={asset.images[0]}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader>
              <CardDescription>Asset</CardDescription>
              <CardTitle className="text-lg leading-tight">
                {asset ? (
                  <Link
                    to={`/marketplace/${asset.id}`}
                    className="hover:underline"
                  >
                    {asset.name}
                  </Link>
                ) : (
                  "Asset Loading..."
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {asset && (
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{asset.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Info className="h-4 w-4 text-primary" />
                    <span>{asset.type.replace("_", " ")}</span>
                  </div>
                  <Link to={`/marketplace/${asset.id}`} className="block mt-4">
                    <Button variant="outline" className="w-full">
                      View Asset Details
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
