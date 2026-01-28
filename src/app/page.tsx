import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DemoCards from "@/components/DemoCards";
import Philosophy from "@/components/Philosophy";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="page">
      <Navbar />
      <Hero />
      <DemoCards />
      <Philosophy />
      <Footer />
    </main>
  );
}
