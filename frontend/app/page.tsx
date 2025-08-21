import { HydrateClient } from "@/trpc/server";
import Hero from "./_components/hero";
import Navbar from "./_components/Navbar";
import { Features } from "@/components/ui/base-feature";
import PricingSection from "./_components/Prcing";
import TestimonialsSection from "./_components/TestingMonials";
import { Feedback } from "./_components/Feedback";
import { Footer } from "./_components/footer";
import { GetStarted } from "./_components/get-started";
export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-4 overflow-hidden px-4 py-8">
        <Navbar />
        <Hero />
        <Features />
        <PricingSection />
        <TestimonialsSection />
        <GetStarted />
        <Feedback />
        <Footer />
      </main>
    </HydrateClient>
  );
}
