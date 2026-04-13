import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VolunteerForm from "@/components/VolunteerForm";

export const metadata: Metadata = {
  title: "Volunteer — FRC Manila",
  description:
    "Apply to join the FRC Manila crew as a pacer, marketer, content creator, or operations volunteer. Voluntary roles — no pay, but a front-row seat to building something real.",
  openGraph: {
    title: "Volunteer — FRC Manila",
    description:
      "Apply to join the FRC Manila crew as a pacer, marketer, content creator, or operations volunteer.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Volunteer — FRC Manila",
    description:
      "Apply to join the FRC Manila crew as a pacer, marketer, content creator, or operations volunteer.",
  },
};

export default function VolunteerPage() {
  return (
    <>
      <Nav />
      <VolunteerForm />
      <Footer />
    </>
  );
}
