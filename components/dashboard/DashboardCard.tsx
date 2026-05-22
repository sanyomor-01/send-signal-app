"use client";

import { ReactNode } from "react";

interface DashboardCardProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
}

export function DashboardCard({
  title,
  subtitle,
  children,
  footer,
  noPadding = false,
}: DashboardCardProps) {
  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid var(--color-outline-variant)",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      {title && (
        <div style={{ padding: noPadding ? "0" : "1.5rem" }}>
          <h3
            style={{
              fontSize: "var(--font-headline-medium-size)",
              fontWeight: 600,
              color: "var(--color-on-surface)",
              margin: 0,
              marginBottom: subtitle ? "0.25rem" : 0,
            }}
          >
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                fontSize: "var(--font-body-medium-size)",
                color: "var(--color-on-surface-variant)",
                margin: 0,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, padding: noPadding ? "0" : "1.5rem" }}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div
          style={{
            padding: noPadding ? "0" : "1rem 1.5rem",
            borderTop: "1px solid var(--color-outline-variant)",
            backgroundColor: "rgba(250, 250, 250, 0.5)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
