"use server";

import { createBooking, type CreateBookingInput } from "@/services/bookings";

export async function submitBookingAction(input: CreateBookingInput) {
  return createBooking(input);
}
