import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div style={{ padding: "2rem", maxWidth: "44rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1rem" }}>
        Settings
      </h1>
      <p style={{ color: "var(--color-on-surface-variant)", margin: 0 }}>
        Account and workspace settings will appear here as the product expands.
      </p>
    </div>
  );
}
