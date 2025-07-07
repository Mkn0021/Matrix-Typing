"use client"

import Footer from "@/components/HomePage/footer"
import CyberHero from "@/components/HomePage/cyber-hero"
import NeonFeatures from "@/components/HomePage/neon-features"
import HologramStats from "@/components/HomePage/hologram-stats"

export default function HomePage() {
  return (
    <>
      <CyberHero />
      <NeonFeatures />
      <HologramStats />
      <Footer />
    </>
  )
}
