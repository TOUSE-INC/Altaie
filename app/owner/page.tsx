import type { Metadata } from "next";
import { OwnerDashboard } from "./OwnerDashboard";
import "./owner.css";

export const metadata: Metadata = {
  title: "Owner command center",
  description: "Interactive Altaie operations and business dashboard for the company owner.",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return <OwnerDashboard />;
}
