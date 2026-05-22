"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  action?: ReactNode;
}

export function ChartCard({
  title,
  subtitle,
  children,
  footer,
  action,
}: ChartCardProps) {
  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid var(--color-outline-variant)",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        padding: "1.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
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
        {action && <div>{action}</div>}
      </div>

      {/* Content */}
      <div style={{ marginBottom: "1rem" }}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          style={{
            paddingTop: "1rem",
            borderTop: "1px solid var(--color-outline-variant)",
            fontSize: "var(--font-label-small-size)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
}
