"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowRight } from "iconsax-react";

interface QuickActionItemProps {
  icon: ReactNode;
  label: string;
  href?: string;
  onClick?: () => void;
}

export function QuickActionItem({
  icon,
  label,
  href,
  onClick,
}: QuickActionItemProps) {
  const content = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem",
        borderRadius: "0.5rem",
        cursor: href || onClick ? "pointer" : "default",
        backgroundColor: "white",
        border: "1px solid var(--color-outline-variant)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (href || onClick) {
          e.currentTarget.style.backgroundColor =
            "var(--color-surface-container)";
          e.currentTarget.style.borderColor = "var(--color-primary)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white";
        e.currentTarget.style.borderColor = "var(--color-outline-variant)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: "2rem",
            height: "2rem",
            borderRadius: "0.375rem",
            backgroundColor: "var(--color-primary-container)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-primary)",
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontSize: "var(--font-body-medium-size)",
            fontWeight: 500,
            color: "var(--color-on-surface)",
          }}
        >
          {label}
        </span>
      </div>
      {(href || onClick) && (
        <ArrowRight size={18} color="var(--color-on-surface-variant)" />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}
