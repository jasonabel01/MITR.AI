"use client";

import React, { useState } from "react";
import { Search, Star, Menu, X, Shield, Sparkles, MonitorPlay } from "lucide-react";

export interface EscapeHeroProps {
  backgroundImageUrl?: string;
  onSearch?: (query: string) => void;
  onEnterSanctuary?: () => void;
  onEarlyAccess?: () => void;
  onOpenSandbox?: () => void;
}

// High-res alpine mountain landscape with morning sunlight, pine forest & river
const DEFAULT_BG_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=90";

const BACKUP_BG_IMAGE =
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=90";

export const EscapeHero: React.FC<EscapeHeroProps> = ({
  backgroundImageUrl = DEFAULT_BG_IMAGE,
  onSearch,
  onEnterSanctuary,
  onOpenSandbox,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(backgroundImageUrl);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else if (onEnterSanctuary) {
      onEnterSanctuary();
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundColor: "#1c232e",
        fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
      }}
    >
      {/* ── 1. Full-Bleed Alpine Mountain Sunrise Background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        <img
          src={imgSrc}
          onError={() => setImgSrc(BACKUP_BG_IMAGE)}
          alt="Scenic alpine sunrise landscape with pine forest, river, and mountains"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 38%",
            display: "block",
          }}
        />
        {/* Soft top gradient for crisp navigation contrast */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "130px",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Soft bottom gradient for trust bar readability and seamless transition to Sanctuary section */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "260px",
            background: "linear-gradient(to bottom, transparent 0%, rgba(11, 15, 25, 0.35) 45%, rgba(11, 15, 25, 0.85) 80%, #0B0F19 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* ── 2. Unified Transparent Navigation Bar ── */}
      <header
        style={{
          position: "relative",
          zIndex: 30,
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "24px 32px 12px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo: MitrAI with Emerald Accent */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #10B981, #0D9488)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
            }}
          >
            <Shield size={18} color="#ffffff" />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, Cambria, serif",
              fontSize: "26px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#111827",
            }}
          >
            MitrAI
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
          className="hidden md:flex"
        >
          <a
            href="#hero"
            style={{
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1f2937")}
          >
            Overview
          </a>
          <a
            href="#sanctuary"
            style={{
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1f2937")}
          >
            The Sanctuary
          </a>
          <a
            href="#features"
            style={{
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1f2937")}
          >
            Safety Architecture
          </a>
          <a
            href="#helplines"
            style={{
              color: "#1f2937",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              transition: "color 0.2s",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#059669")}
            onMouseOut={(e) => (e.currentTarget.style.color = "#1f2937")}
          >
            24/7 Helplines (14416)
          </a>
        </nav>

        {/* Action Button Cluster */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {onOpenSandbox && (
            <button
              onClick={onOpenSandbox}
              className="hidden sm:inline-flex"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.85)",
                color: "#111827",
                fontSize: "13px",
                fontWeight: 600,
                padding: "10px 18px",
                borderRadius: "9999px",
                border: "1px solid rgba(0,0,0,0.1)",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.85)")}
            >
              <MonitorPlay size={14} color="#059669" />
              <span>Judge Sandbox</span>
            </button>
          )}

          <button
            onClick={onEnterSanctuary}
            style={{
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              padding: "10px 24px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.22)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
          >
            <Sparkles size={14} fill="#10B981" color="#10B981" />
            <span>Enter Sanctuary</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{
              padding: "8px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(0,0,0,0.1)",
              color: "#111827",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            left: "16px",
            right: "16px",
            zIndex: 50,
            padding: "24px",
            borderRadius: "24px",
            backgroundColor: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            textAlign: "center",
          }}
          className="md:hidden"
        >
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#111827", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}
          >
            Overview
          </a>
          <a
            href="#sanctuary"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#111827", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}
          >
            The Sanctuary
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#111827", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}
          >
            Safety Architecture
          </a>
          <a
            href="#helplines"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: "#111827", fontSize: "16px", fontWeight: 600, textDecoration: "none" }}
          >
            24/7 Helplines (14416)
          </a>
          {onOpenSandbox && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSandbox();
              }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "9999px",
                backgroundColor: "#f3f4f6",
                color: "#111827",
                fontSize: "14px",
                fontWeight: 600,
                border: "1px solid #e5e7eb",
                cursor: "pointer",
              }}
            >
              Launch Judge Sandbox
            </button>
          )}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onEnterSanctuary?.();
            }}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "9999px",
              backgroundColor: "#111827",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              marginTop: "4px",
              cursor: "pointer",
            }}
          >
            Enter Sanctuary
          </button>
        </div>
      )}

      {/* ── 3. Central Hero Content Area ── */}
      <main
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          maxWidth: "960px",
          margin: "auto",
          padding: "24px 20px 32px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Headline Stacked Across Two Lines */}
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, Cambria, serif",
            fontSize: "clamp(38px, 6vw, 66px)",
            fontWeight: 500,
            lineHeight: 1.18,
            letterSpacing: "-0.02em",
            color: "#111827",
            marginBottom: "18px",
            maxWidth: "880px",
          }}
        >
          <div style={{ display: "block" }}>The best place to find</div>
          <div style={{ display: "block" }}>
            <span>your </span>
            <span
              style={{
                fontFamily: "'Caveat', cursive, serif",
                fontSize: "1.25em",
                color: "#E8DCC8",
                fontStyle: "italic",
                fontWeight: 700,
                textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)",
                letterSpacing: "0.01em",
                display: "inline-block",
                transform: "translateY(2px)",
              }}
            >
              Inner Peace
            </span>
          </div>
        </h1>

        {/* Subheadline Paragraph */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "clamp(13px, 1.8vw, 16px)",
            fontWeight: 500,
            color: "#374151",
            maxWidth: "560px",
            margin: "0 auto 36px auto",
            lineHeight: 1.6,
          }}
        >
          Feeling ready to relax ? Find the best location to reconnect with nature and find inner calm.
        </p>

        {/* Search Bar Component */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            width: "100%",
            maxWidth: "540px",
            backgroundColor: "#ffffff",
            borderRadius: "9999px",
            padding: "6px 6px 6px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 14px 38px rgba(0, 0, 0, 0.18), 0 2px 6px rgba(0,0,0,0.08)",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a topic or concern (e.g. Exam Stress, Loneliness)..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                color: "#111827",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: "#181a1f",
              color: "#ffffff",
              fontSize: "13px",
              fontWeight: 600,
              padding: "12px 24px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#000000")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#181a1f")}
          >
            Find Safe Peer
          </button>
        </form>

        {/* Rating Glassmorphic Card */}
        <div
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px 28px",
            borderRadius: "18px",
            backgroundColor: "rgba(17, 24, 39, 0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.22)",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
            <Star size={18} fill="#FBBF24" color="#FBBF24" />
          </div>
          <div
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.01em",
              lineHeight: 1.3,
            }}
          >
            4.9 out of 5
          </div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.85)",
              lineHeight: 1.3,
            }}
          >
            from over 2,000+ Safe Peer Connections
          </div>
        </div>
      </main>

      {/* ── 4. Bottom Social Proof & Trust Bar ── */}
      <footer
        style={{
          position: "relative",
          zIndex: 20,
          width: "100%",
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "12px 24px 28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.9)",
            textShadow: "0 1px 4px rgba(0,0,0,0.6)",
            margin: 0,
          }}
        >
          Trusted across mental health communities & verified crisis networks
        </p>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            columnGap: "48px",
            rowGap: "16px",
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            Tele-MANAS (14416)
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "19px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            NIMHANS Guidelines
          </span>
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
            }}
          >
            KIRAN Helpline
          </span>
          <span
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "16px",
              fontWeight: 500,
              letterSpacing: "-0.01em",
            }}
          >
            DPDP / HIPAA Blueprint
          </span>
        </div>
      </footer>
    </div>
  );
};

export default EscapeHero;
