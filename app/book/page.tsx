import type { Metadata } from "next";
import { DirectBooking } from "./DirectBooking";
import "./booking.css";

export const metadata: Metadata = { title: "Book a ride", description: "Book a fixed-price Altaie chauffeur assignment in Washington, DC." };

export default function BookPage() {
  return <DirectBooking />;
}
