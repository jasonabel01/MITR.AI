"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WorkPageHeroDemo } from "@/components/ui/demo";

export default function HeroDemoPage() {
  return (
    <div className="relative">
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MitrAI</span>
        </Link>
      </div>
      <WorkPageHeroDemo />
    </div>
  );
}
