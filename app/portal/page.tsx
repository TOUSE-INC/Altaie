import type { Metadata } from "next";
import { PortalPrototype } from "./PortalPrototype";
import { AdvancedMobilePortal } from "./AdvancedMobilePortal";
import "./portal.css";
import "./mobile-safari.css";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Altaie executive transportation coordination, ride status, traveler preferences, and booking requests.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return (
    <>
      <AdvancedMobilePortal />
      <div className="portal-desktop-existing">
        <PortalPrototype />
      </div>
    </>
  );
}
