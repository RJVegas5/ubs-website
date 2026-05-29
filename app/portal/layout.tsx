import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Portal | UBS — Ultimate Building Services",
  description: "Access your UBS customer portal to view appointments, estimates, invoices, and service history.",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
