"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EscapeHero } from "@/components/ui/escape-hero";

export default function EscapePage() {
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Floating Return Button */}
      <div style={{ position: "fixed", bottom: "20px", left: "20px", zIndex: 60 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            borderRadius: "9999px",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          <ArrowLeft size={14} />
          <span>Return to MitrAI App</span>
        </Link>
      </div>

      <EscapeHero
        onSearch={(query) => {
          if (query) alert(`Searching locations for: "${query}"`);
        }}
        onEarlyAccess={() => {
          alert("Thank you! Early access invitation registered.");
        }}
      />
    </div>
  );
}
