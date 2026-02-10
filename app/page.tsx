import FeaturesSection from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { Navbar } from "@/components/landing/navbar";
import PCI from "@/components/landing/pci";
import RolesSection from "@/components/landing/roles";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <FeaturesSection />
      <PCI />
      <RolesSection />
      <Footer />
    </main>
  );
}
