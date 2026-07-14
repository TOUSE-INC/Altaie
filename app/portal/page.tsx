import type { Metadata } from "next";
import { PortalPrototype } from "./PortalPrototype";
import "./portal.css";

export const metadata: Metadata = {
  title: "Client portal preview",
  description: "Interactive Altaie client portal prototype for executive transportation coordination.",
  robots: { index: false, follow: false },
};

export default function PortalPage() {
  return <PortalPrototype />;
}
