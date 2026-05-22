"use client";

import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "iconsax-react";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  trend?: {
    percentage: number;
    period: string;
  };
  sparkline?: React.ReactNode;
}

export function MetricCard({
  icon,
  label,
  value,
  trend,
  sparkline,
}: MetricCardProps) {
  const isPositive = trend && trend.percentage >= 0;

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "0.75rem",
        border: "1px solid var(--color-outline-variant)",
        backgroundColor: "white",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-outline)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 91, 4, 0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-outline-variant)";
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(0, 0, 0, 0.05)";
      }}
    >
      {/* Header with icon and trend */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
        {trend && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.375rem",
              backgroundColor: isPositive
                ? "rgba(34, 197, 94, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
              color: isPositive ? "#22c55e" : "#ef4444",
              fontSize: "var(--font-label-small-size)",
              fontWeight: 500,
            }}
          >
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span>{Math.abs(trend.percentage)}%</span>
          </div>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          fontSize: "var(--font-label-medium-size)",
          color: "var(--color-on-surface-variant)",
          marginBottom: "0.5rem",
        }}
      >
        {label}
      </div>

      {/* Large value */}
      <div
        style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          color: "var(--color-on-surface)",
          lineHeight: 1,
          marginBottom: "0.75rem",
        }}
      >
        {value}
      </div>

      {/* Trend period */}
      {trend && (
        <div
          style={{
            fontSize: "var(--font-label-small-size)",
            color: "var(--color-on-surface-variant)",
          }}
        >
          {isPositive ? "+" : ""}
          {trend.percentage}% {trend.period}
        </div>
      )}

      {/* Sparkline */}
      {sparkline && <div style={{ marginTop: "1rem" }}>{sparkline}</div>}
    </div>
  );
}
