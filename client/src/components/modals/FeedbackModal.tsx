import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Star } from "lucide-react";
import { useSubmitFeedback } from "@/hooks/use-bookings";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number;
}

export function FeedbackModal({
  isOpen,
  onClose,
  bookingId,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate: submitFeedback, isPending } = useSubmitFeedback();

  const handleSubmit = () => {
    if (rating === 0) return;

    submitFeedback(
      { bookingId, data: { rating, comment } },
      {
        onSuccess: () => {
          onClose();
          setRating(0);
          setComment("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave Feedback</DialogTitle>
          <DialogDescription>
            How was your experience with this asset? Your feedback helps improve
            the community.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Rate your experience</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`p-1 transition-colors hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-full ${
                    rating >= star
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground"
                  }`}
                >
                  <Star
                    className={`h-8 w-8 ${rating >= star ? "fill-current" : ""}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="comment" className="text-sm font-medium">
              Comments (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Tell us more about the asset condition and usage..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0 || isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
