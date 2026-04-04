import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MerchPreview from "@/components/MerchPreview";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Partners from "@/components/Partners";
import Team from "@/components/Team";
import Gallery from "@/components/Gallery";
import JoinCTA from "@/components/JoinCTA";
import Footer from "@/components/Footer";
import { getGalleryPhotos, type Photo } from "@/lib/gallery";

export default async function Home() {
  let photos: Photo[] = [];
  try {
    const result = await getGalleryPhotos({ all: true });
    photos = result.photos;
  } catch {
    // Gallery photos are non-critical; page renders without them
  }

  return (
    <main>
      <Nav />
      <Hero />
      <MerchPreview />
      <About photos={photos} />
      <Stats photos={photos.slice(0, 10)} />
      <Partners />
      <Team />
      <Gallery photos={photos} />
      <JoinCTA />
      <Footer />
    </main>
  );
}
