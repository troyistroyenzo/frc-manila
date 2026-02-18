import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import PhotoStrip from "@/components/PhotoStrip";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Partners from "@/components/Partners";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <PhotoStrip />
      <About />
      <Stats />
      <Partners />
      <Team />
      <Gallery />
      <JoinCTA />
      <Footer />
    </main>
  );
}
