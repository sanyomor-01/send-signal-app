"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Add, Import, DocumentText } from "iconsax-react";

interface WelcomeSectionProps {
  userName?: string | null;
}

export function WelcomeSection({ userName = null }: WelcomeSectionProps) {
  const displayName = userName || "there";
  const quickActionButtonStyle = { padding: "0.625rem 0.9375rem" };

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        marginBottom: "2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: "2rem",
      }}
    >
      {/* Left side: Welcome text */}
      <div style={{ flex: 1 }}>
        <h1
          style={{
            fontSize: "var(--font-title-large-size)",
            fontWeight: 500,
            color: "var(--color-on-surface)",
            margin: 0,
            marginBottom: "0.5rem",
          }}
        >
          Welcome back, {displayName}! 👋
        </h1>
        <p
          style={{
            fontSize: "var(--font-body-large-size)",
            color: "var(--color-on-surface-variant)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Turn new social leads into real WhatsApp conversations.
        </p>
      </div>

      {/* Right side: Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          alignItems: "baseline",
          alignSelf: "flex-end",
        }}
      >
        <Link
          href="/dashboard/campaigns/new"
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="primary"
            size="md"
            icon={<Add size={18} color="currentColor" />}
            style={quickActionButtonStyle}
          >
            New Campaign
          </Button>
        </Link>
        <Link href="/dashboard/leads/import" style={{ textDecoration: "none" }}>
          <Button
            variant="secondary"
            size="md"
            icon={<Import size={18} color="currentColor" />}
            style={quickActionButtonStyle}
          >
            Import Leads
          </Button>
        </Link>
        <Link
          href="/dashboard/templates/new"
          style={{ textDecoration: "none" }}
        >
          <Button
            variant="secondary"
            size="md"
            icon={<DocumentText size={18} color="currentColor" />}
            style={quickActionButtonStyle}
          >
            Create Template
          </Button>
        </Link>
      </div>
    </div>
  );
}
