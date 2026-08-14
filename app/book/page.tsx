import type { Metadata } from "next";
import { AltaieTripExperience } from "./AltaieTripExperience";
import "./booking.css";
import "./experience.css";
import "./mobile-safari.css";

export const metadata: Metadata = { title: "Request a ride", description: "Request an Altaie private-beta chauffeur assignment for desk confirmation in Washington, DC." };

export default function BookPage() {
  return <AltaieTripExperience />;
}
