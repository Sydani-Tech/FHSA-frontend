import { useParams, Link, useNavigate } from "react-router-dom";
import { useBooking, useUpdateBookingStatus } from "@/hooks/use-bookings";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Loader2,
  Calendar,
  MapPin,
  ArrowLeft,
  Clock,
  Info,
  Hash,
  User,
  Phone,
  Building,
  Check,
  X,
  CreditCard,
  Truck,
  Undo2,
  History,
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { StepTracker } from "@/components/shared/StepTracker";

// Helper to format audit details
// Helper to format audit details
const formatAuditDetails = (action: string, details: any) => {
  if (!details) return null;

  try {
    const data = typeof details === "string" ? JSON.parse(details) : details;

    if (action === "Status Updated" && data.from && data.to) {
      const formatStatus = (s: string) =>
        s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
      return `Status changed from "${formatStatus(data.from)}" to "${formatStatus(data.to)}"`;
    }

    if (action === "Payment Received" && data.amount) {
      return `Amount: ₦${Number(data.amount).toLocaleString()} (Ref: ${data.ref || "N/A"})`;
    }

    return JSON.stringify(data);
  } catch (e) {
    return String(details);
  }
};

export default function AdminBookingDetail() {
  const { id } = useParams();
  const bookingId = Number(id);
  const navigate = useNavigate();

  const { data: booking, isLoading, error } = useBooking(bookingId);

  const updateStatusMutation = useUpdateBookingStatus();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Booking not found</h2>
        <Link to="/admin/bookings">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Queue
          </Button>
        </Link>
      </div>
    );
  }

  const { user, asset } = booking;

  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ id: bookingId, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link to="/admin/bookings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
            Booking Request
            <span className="text-base font-normal text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full ml-2">
              <Hash className="h-4 w-4" /> {booking.reference_code}
            </span>
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Clock className="h-3 w-3" /> Requested on{" "}
            {format(new Date(booking.created_at), "PPP p")}
          </div>
        </div>
        <div className="ml-auto">
          <StatusBadge
            status={booking.status}
            role="admin"
            className="text-sm px-4 py-1.5"
          />
        </div>
      </div>

      <StepTracker currentStatus={booking.status} />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Col: Request Info & Asset */}
        <div className="md:col-span-2 space-y-6">
          {/* User Profile Card */}
          <Card className="border-black/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" /> Requester Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Business Name
                    </label>
                    <div className="text-base font-medium flex items-center gap-2">
                      <Building className="h-4 w-4 text-primary/70" />
                      {user.business_name || "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Contact Name
                    </label>
                    <div className="text-base">
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : "N/A"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Email
                    </label>
                    <div className="text-base">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Phone
                    </label>
                    <div className="text-base flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary/70" />
                      {user.phone || "N/A"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Location
                    </label>
                    <div className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary/70" />
                      {user.location || "N/A"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground italic">
                  User details not available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Specifics */}
          <Card className="border-black/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5 text-primary" /> Booking Request
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 bg-muted/40 p-3 rounded-md">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> Start Date
                  </span>
                  <p className="font-semibold text-lg">
                    {booking.dates?.start
                      ? format(new Date(booking.dates.start), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1 bg-muted/40 p-3 rounded-md">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" /> End Date
                  </span>
                  <p className="font-semibold text-lg">
                    {booking.dates?.end
                      ? format(new Date(booking.dates.end), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Purpose of Use
                </span>
                <div className="bg-muted/30 p-4 rounded-lg text-foreground/90 leading-relaxed border border-border/50">
                  {booking.purpose}
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Requested Quantity
                </span>
                <div className="text-lg font-semibold">
                  {booking.quantity} Units
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline / Audit Log */}
          <Card className="border-black/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 border-l-2 border-muted ml-3 pl-6 relative">
                {booking.audits
                  ?.sort(
                    (a, b) =>
                      new Date(b.timestamp).getTime() -
                      new Date(a.timestamp).getTime(),
                  )
                  .map((audit) => (
                    <div key={audit.id} className="relative">
                      <div className="absolute -left-[31px] top-1 h-3 w-3 bg-primary rounded-full border-2 border-background ring-2 ring-muted" />
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">
                          {audit.action}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(audit.timestamp),
                            "MMM d, yyyy h:mm a",
                          )}
                        </span>
                        {audit.details && (
                          <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-1">
                            {formatAuditDetails(audit.action, audit.details)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 bg-muted rounded-full border-2 border-background" />
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-muted-foreground">
                      Booking Created
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(
                        new Date(booking.created_at),
                        "MMM d, yyyy h:mm a",
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Asset & Actions */}
        <div className="space-y-6">
          {/* Actions Card */}
          <Card className="border-primary/20 bg-primary/5 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Admin Actions</CardTitle>
              <CardDescription>Manage this request</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Pending -> Approve/Reject */}
              {booking.status === "pending" && (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => handleStatusUpdate("awaiting_payment")}
                    disabled={updateStatusMutation.isPending}
                  >
                    {updateStatusMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve Request
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={updateStatusMutation.isPending}
                    // Add reject logic later (needs updated status 'rejected' in backend)
                    onClick={() =>
                      alert(
                        "Rejection flow needs backend support for 'rejected' status or cancellation.",
                      )
                    }
                  >
                    <X className="h-4 w-4 mr-2" /> Reject Request
                  </Button>
                </>
              )}

              {/* Awaiting Payment -> Confirm Payment */}
              {booking.status === "awaiting_payment" && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleStatusUpdate("paid")} // Or confirm payment manually
                  disabled={updateStatusMutation.isPending}
                >
                  Mark Payment Received
                </Button>
              )}

              {/* Paid -> Handover */}
              {booking.status === "paid" && (
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => handleStatusUpdate("in_possession")}
                  disabled={updateStatusMutation.isPending}
                >
                  <Truck className="h-4 w-4 mr-2" /> Confirm Handover
                </Button>
              )}

              {/* In Possession -> Return */}
              {(booking.status === "in_possession" ||
                booking.status === "overdue") && (
                <Button
                  className="w-full bg-orange-600 hover:bg-orange-700"
                  onClick={() => handleStatusUpdate("returned")}
                  disabled={updateStatusMutation.isPending}
                >
                  <Undo2 className="h-4 w-4 mr-2" /> Confirm Return
                </Button>
              )}

              {["returned", "cancelled"].includes(booking.status) && (
                <div className="text-center text-muted-foreground text-sm p-4 bg-background/50 rounded-lg">
                  No further actions available for this status.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-black/10 overflow-hidden">
            {asset?.images?.[0] && (
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={asset.images[0]}
                  alt={asset.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <CardHeader className="pb-2">
              <CardDescription>Requested Asset</CardDescription>
              <CardTitle className="text-lg leading-tight">
                {asset ? (
                  <Link
                    to={`/admin/assets/${asset.id}`}
                    className="hover:underline"
                  >
                    {asset.name}
                  </Link>
                ) : (
                  "Loading Asset..."
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
                  <div className="flex items-end justify-between pt-2 border-t mt-2">
                    <span className="text-muted-foreground">Asset Cost</span>
                    <span className="font-bold text-base">
                      ₦{Number(asset.cost).toLocaleString()}/
                      {asset.duration_options?.[0] || "unit"}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => navigate(`/admin/assets/${asset?.id}`)}
              >
                View Asset Specs
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
