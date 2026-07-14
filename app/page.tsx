import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Catalog from "@/components/Catalog";
import WhyMarphone from "@/components/WhyMarphone";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Location from "@/components/Location";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getFeaturedProducts, getProducts } from "@/lib/product-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, products] = await Promise.all([
    getFeaturedProducts(),
    getProducts(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Featured products={featured} />
        <Catalog products={products} />
        <WhyMarphone />
        <About />
        <Testimonials />
        <Location />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
