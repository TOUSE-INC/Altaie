import type { Metadata } from "next";
import { OwnerDashboard } from "./OwnerDashboard";
import { AdvancedMobileOwner } from "./AdvancedMobileOwner";
import "./owner.css";
import "./mobile-safari.css";

export const metadata: Metadata = {
  title: "Owner command center",
  description: "Altaie private operations command center for live movements, dispatch, network coverage, accounts, and financial visibility.",
  robots: { index: false, follow: false },
};

export default function OwnerPage() {
  return (
    <>
      <div className="owner-desktop-existing">
        <OwnerDashboard />
      </div>
      <AdvancedMobileOwner />
    </>
  );
}
