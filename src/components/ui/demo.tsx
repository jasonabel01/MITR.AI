import React from "react";
import { WorkPageHero } from "@/components/ui/work-page-hero";

export function WorkPageHeroDemo() {
  return (
    <div className="w-full min-h-screen bg-[#0a0a0a] text-white">
      {/* 1. Hero Section with Scroll-Expand Video */}
      <WorkPageHero
        videoSrc="https://res.cloudinary.com/dsuwzuaxp/video/upload/video1_horxtt.mp4"
        topWord="creating"
        rightWord="your"
        bottomWord="story"
        accentColor="#f97316"
        textColor="#000000"
        backgroundColor="#fafafa"
        showClocks={true}
        clocks={[
          { tz: "Asia/Kolkata", label: "INDIA" },
          { tz: "America/New_York", label: "NEW YORK" },
          { tz: "Asia/Dubai", label: "DUBAI" },
        ]}
      />

      {/* 2. Scrollable Content to demonstrate the pinned expand effect */}
      <section className="relative z-40 bg-[#0f0f11] py-24 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-orange-500 font-mono">
              Selected Showcase
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
              Crafting immersive digital experiences
            </h2>
            <p className="text-zinc-400 max-w-2xl text-base md:text-lg">
              Scroll back up to watch the hero video smoothly contract into the kinetic typography pill.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Brand Identity",
                tag: "Strategy & Motion",
                desc: "Dynamic motion identity and visual systems for modern brands.",
              },
              {
                title: "Interactive Web",
                tag: "GSAP & WebGL",
                desc: "Fluid interactions, 3D scenes, and responsive visual storytelling.",
              },
              {
                title: "Art Direction",
                tag: "CGI & Editorial",
                desc: "High-impact visual narratives tailored for digital platforms.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-zinc-900/60 border border-white/10 hover:border-orange-500/50 transition-colors group"
              >
                <div className="text-xs font-mono text-orange-400 mb-4">{card.tag}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-orange-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default WorkPageHeroDemo;
