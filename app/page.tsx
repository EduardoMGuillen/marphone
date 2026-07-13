import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Catalog from "@/components/Catalog";
import WhyMarphone from "@/components/WhyMarphone";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import { getFeaturedProducts, products } from "@/lib/products";

export default function Home() {
  const featured = getFeaturedProducts();

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
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
