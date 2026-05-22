"use client";

import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  const actionContent = action && (
    <span
      style={{
        fontSize: "var(--font-label-medium-size)",
        fontWeight: 500,
        color: "var(--color-primary)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-primary-dark)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-primary)";
      }}
    >
      {action.label}
    </span>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1.5rem",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "var(--font-headline-medium-size)",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            margin: 0,
            marginBottom: subtitle ? "0.25rem" : 0,
          }}
        >
          {title}
        </h2>
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
      {action &&
        (action.href ? (
          <Link href={action.href} style={{ textDecoration: "none" }}>
            {actionContent}
          </Link>
        ) : (
          <span onClick={action.onClick}>{actionContent}</span>
        ))}
    </div>
  );
}
