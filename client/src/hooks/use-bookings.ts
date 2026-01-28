import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/core/services/booking.service";
import type { BookingCreate } from "@/core/lib/types";
import { useToast } from "@/hooks/use-toast";

export const useBookings = () => {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: bookingService.getAll,
  });
};

export const useBooking = (id: number) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: BookingCreate) => bookingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard-stats"] });
      toast({
        title: "Booking Created",
        description: "Your booking request has been submitted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      bookingService.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard-stats"] });
      toast({
        title: "Status Updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => bookingService.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard-stats"] });
      toast({
        title: "Booking Cancelled",
        description: "The booking has been successfully cancelled.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel booking",
        variant: "destructive",
      });
    },
  });
};

export const usePayBooking = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
  
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: any }) => bookingService.pay(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking", id] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard-stats"] });
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed and receipt generated.",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Payment Failed",
          description: error.message || "Could not process payment",
          variant: "destructive",
        });
      },
    });
  };

export const useSubmitFeedback = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();
  
    return useMutation({
      mutationFn: ({ bookingId, data }: { bookingId: number; data: any }) => 
        bookingService.feedback(bookingId, data),
      onSuccess: (_, { bookingId }) => {
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
        // Feedback might affect dashboard/assets ratings? Maybe assets.
        queryClient.invalidateQueries({ queryKey: ["assets"] });
        toast({
          title: "Feedback Submitted",
          description: "Thank you for your feedback!",
        });
      },
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to submit feedback",
          variant: "destructive",
        });
      },
    });
  };
