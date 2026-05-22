"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShieldTick, Warning2 } from "iconsax-react";
import { DashboardCard } from "./DashboardCard";

interface WhatsAppConnectionCardProps {
  isConnected: boolean;
  phoneNumber?: string;
  qualityRating?: string;
  manageHref?: string;
}

export function WhatsAppConnectionCard({
  isConnected,
  phoneNumber,
  qualityRating,
  manageHref = "/onboarding",
}: WhatsAppConnectionCardProps) {
  if (isConnected) {
    return (
      <DashboardCard title="WhatsApp Connection">
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "3rem",
                height: "3rem",
                borderRadius: "50%",
                backgroundColor: "#22c55e20",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22c55e",
              }}
            >
              <ShieldTick size={24} variant="Bold" />
            </div>
            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: "var(--font-headline-medium-size)",
                  fontWeight: 600,
                  color: "#22c55e",
                  margin: 0,
                  marginBottom: "0.25rem",
                }}
              >
                Connected
              </h4>
              {phoneNumber && (
                <p
                  style={{
                    fontSize: "var(--font-body-medium-size)",
                    color: "var(--color-on-surface-variant)",
                    margin: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  {phoneNumber}
                </p>
              )}
              {qualityRating && (
                <p
                  style={{
                    fontSize: "var(--font-label-medium-size)",
                    color: "var(--color-on-surface-variant)",
                    margin: 0,
                  }}
                >
                  Quality Rating:{" "}
                  <strong style={{ color: "#22c55e" }}>{qualityRating}</strong>
                </p>
              )}
            </div>
          </div>
          <Link href={manageHref} style={{ textDecoration: "none" }}>
            <Button variant="outline" fullWidth>
              Manage Connection
            </Button>
          </Link>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard title="WhatsApp Connection">
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "50%",
              backgroundColor: "#f59e0b20",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f59e0b",
            }}
          >
            <Warning2 size={24} variant="Bold" />
          </div>
          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontSize: "var(--font-headline-medium-size)",
                fontWeight: 600,
                color: "#f59e0b",
                margin: 0,
                marginBottom: "0.5rem",
              }}
            >
              Not Connected
            </h4>
            <p
              style={{
                fontSize: "var(--font-body-medium-size)",
                color: "var(--color-on-surface-variant)",
                margin: 0,
                marginBottom: "1rem",
              }}
            >
              Connect your WhatsApp Business account to start sending messages.
            </p>
          </div>
        </div>
        <Link href={manageHref} style={{ textDecoration: "none" }}>
          <Button variant="primary" fullWidth>
            Connect WhatsApp
          </Button>
        </Link>
      </div>
    </DashboardCard>
  );
}
