import { authApi } from "@/core/api/api-client";
import type { Booking, BookingCreate, BookingUpdateStatus, Payment, PaymentCreate } from "@/core/lib/types";

export const bookingService = {
  // Business/User
  getAll: () => authApi.get<Booking[]>("/bookings"),
  getById: (id: number) => authApi.get<Booking>(`/bookings/${id}`),
  create: (data: BookingCreate) => authApi.post<Booking>("/bookings", data),
  cancel: (id: number) => authApi.post<Booking>(`/bookings/${id}/cancel`, {}),
  pay: (id: number, data: PaymentCreate) => authApi.post<Payment>(`/bookings/${id}/pay`, data),
  getReceipt: (id: number) => authApi.get<{content: string}>(`/bookings/${id}/receipt`),
  
  // Admin
  updateStatus: (id: number, status: string) => 
    authApi.patch<Booking>(`/bookings/${id}/status`, { status }),

  feedback: (id: number, data: any) => authApi.post<any>(`/bookings/${id}/feedback`, data),
};
