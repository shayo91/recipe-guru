import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { FeaturePreview } from "@/components/feature-preview";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl px-6 sm:px-8">
        <Hero />
        <FeaturePreview />
      </main>
      <Footer />
    </div>
  );
}
