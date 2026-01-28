import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard, Download, CheckCircle2 } from "lucide-react";
import { usePayBooking } from "@/hooks/use-bookings";
import { bookingService } from "@/core/services/booking.service";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
  amount: string; // Suggested amount
}

export function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  amount,
}: PaymentModalProps) {
  const [step, setStep] = useState<"pay" | "success">("pay");
  const [receiptContent, setReceiptContent] = useState<string | null>(null);

  const { mutate: payBooking, isPending } = usePayBooking();

  const handlePay = () => {
    // Simulate payment data
    const paymentData = {
      amount: amount || "0",
      method: "card",
    };

    payBooking(
      { id: bookingId, data: paymentData },
      {
        onSuccess: async () => {
          setStep("success");
          // Fetch receipt immediately for download
          try {
            const res = await bookingService.getReceipt(bookingId);
            setReceiptContent(res.content);
          } catch (e) {
            console.error("Failed to fetch receipt", e);
          }
        },
      },
    );
  };

  const downloadReceipt = () => {
    if (!receiptContent) return;
    const element = document.createElement("a");
    const file = new Blob([receiptContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `Receipt-${bookingId}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleClose = () => {
    setStep("pay");
    setReceiptContent(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === "pay" ? (
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Pay securely to confirm your booking.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 border rounded-lg bg-muted/50 flex justify-between items-center">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-bold">
                  ₦{Number(amount).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <Label>Payment Method</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    className="h-14 border-primary bg-primary/5 text-primary"
                  >
                    <CreditCard className="mr-2 h-5 w-5" /> Card
                  </Button>
                  <Button variant="outline" className="h-14" disabled>
                    Bank Transfer
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Card Details</Label>
                <Input
                  placeholder="0000 0000 0000 0000"
                  disabled
                  value="4242 4242 4242 4242"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="MM/YY" disabled value="12/28" />
                  <Input placeholder="CVC" disabled value="123" />
                </div>
                <p className="text-xs text-muted-foreground">
                  Mock Payment Gateway (Test Mode)
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handlePay}
                disabled={isPending}
                className="w-full"
              >
                {isPending ? (
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                ) : (
                  "Pay Now"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-600">
                  Payment Successful!
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Your booking has been confirmed.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={downloadReceipt}
              >
                <Download className="mr-2 h-4 w-4" /> Download Receipt
              </Button>

              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
