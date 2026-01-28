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
  History,
  CreditCard,
  Star,
} from "lucide-react";
import { format } from "date-fns";
import { StepTracker } from "@/components/shared/StepTracker";
import { useCancelBooking } from "@/hooks/use-bookings";
import { PaymentModal } from "@/components/modals/PaymentModal";
import { FeedbackModal } from "@/components/modals/FeedbackModal";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function BookingDetailPage() {
  const { id } = useParams();
  const bookingId = Number(id);

  const {
    data: booking,
    isLoading: isLoadingBooking,
    error,
  } = useBooking(bookingId);

  // We fetch asset details using the asset_id from the booking
  const assetId = booking?.asset_id;
  const { data: asset, isLoading: isLoadingAsset } = useAsset(assetId || 0);

  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const handleCancel = () => {
    if (booking) {
      cancelBooking(booking.id);
    }
  };

  if (isLoadingBooking || (assetId && isLoadingAsset)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold">Booking not found</h2>
        <Link to="/bookings">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
          </Button>
        </Link>
      </div>
    );
  }

  const canCancel = ["pending", "awaiting_payment"].includes(booking.status);
  const canPay = booking.status === "awaiting_payment";

  const estimatedAmount = asset
    ? (parseInt(asset.cost) * booking.quantity).toString()
    : "0";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        bookingId={bookingId}
        amount={estimatedAmount}
      />
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        bookingId={bookingId}
      />
      <div className="flex items-center gap-4 mb-2">
        <Link to="/bookings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-display text-primary flex items-center gap-2">
            Booking Details
            <span className="text-base font-normal text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full ml-2">
              <Hash className="h-4 w-4" /> {booking.reference_code}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">ID: #{booking.id}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {canPay && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setIsPaymentModalOpen(true)}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Pay Now
            </Button>
          )}
          {canCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isCancelling}>
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    "Cancel Booking"
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently cancel
                    your booking request.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancel}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Yes, Cancel Booking
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <StatusBadge
            status={booking.status}
            role="business_user"
            className="text-sm px-3 py-1"
          />
        </div>
      </div>

      <StepTracker currentStatus={booking.status} />

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
                    {booking.dates?.start
                      ? format(new Date(booking.dates.start), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> End Date
                  </span>
                  <p className="font-medium text-lg">
                    {booking.dates?.end
                      ? format(new Date(booking.dates.end), "MMM d, yyyy")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Purpose
                </span>
                <div className="bg-muted/30 p-4 rounded-lg text-foreground/90 leading-relaxed">
                  {booking.purpose}
                </div>
              </div>

              <div className="pt-4 border-t">
                <span className="text-sm font-medium text-muted-foreground block mb-2">
                  Payment Status
                </span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${booking.payment_status === "paid" ? "bg-emerald-500" : "bg-yellow-500"}`}
                  />
                  <span className="capitalize font-medium">
                    {booking.payment_status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Created on
                </span>
                <span>
                  {booking.created_at
                    ? format(new Date(booking.created_at), "PPP p")
                    : "N/A"}
                </span>
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

          {/* Feedback Section */}
          {(booking.status === "returned" || booking.feedback) && (
            <Card className="border-black/10">
              <CardHeader>
                <CardTitle className="text-lg">Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {booking.feedback ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < booking.feedback!.rating
                              ? "fill-current"
                              : "text-muted/30"
                          }`}
                        />
                      ))}
                    </div>
                    {booking.feedback.comment && (
                      <p className="text-sm text-foreground/90 italic bg-muted/30 p-3 rounded">
                        "{booking.feedback.comment}"
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Submitted on{" "}
                      {format(
                        new Date(booking.feedback.created_at),
                        "MMM d, yyyy",
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">
                      How was your experience using this asset?
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => setIsFeedbackModalOpen(true)}
                    >
                      Leave Feedback
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
