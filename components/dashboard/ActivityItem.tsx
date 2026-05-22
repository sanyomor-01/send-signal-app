"use client";

import { ReactNode } from "react";

interface ActivityItemProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  timestamp: string;
  color?: "success" | "primary" | "warning" | "info";
}

export function ActivityItem({
  icon,
  title,
  subtitle,
  timestamp,
  color = "info",
}: ActivityItemProps) {
  const colorMap = {
    success: "#22c55e",
    primary: "var(--color-primary)",
    warning: "#f59e0b",
    info: "#3b82f6",
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        paddingBottom: "1rem",
        borderBottom: "1px solid var(--color-outline-variant)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "2.5rem",
          height: "2.5rem",
          borderRadius: "50%",
          backgroundColor: `${colorMap[color]}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colorMap[color],
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4
          style={{
            fontSize: "var(--font-label-medium-size)",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            margin: 0,
            marginBottom: "0.25rem",
          }}
        >
          {title}
        </h4>
        {subtitle && (
          <p
            style={{
              fontSize: "var(--font-body-small-size)",
              color: "var(--color-on-surface-variant)",
              margin: 0,
              marginBottom: "0.5rem",
            }}
          >
            {subtitle}
          </p>
        )}
        <span
          style={{
            fontSize: "var(--font-label-small-size)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {timestamp}
        </span>
      </div>
    </div>
  );
}
