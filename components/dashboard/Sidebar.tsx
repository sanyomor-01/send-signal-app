"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoIcon } from "@/components/brand/LogoIcon";
import {
  Element3,
  Profile2User,
  DirectNotification,
  DocumentText,
  MessageText,
  Sms,
  Graph,
  Setting2,
} from "iconsax-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Element3, exact: true },
  { href: "/dashboard/leads", label: "Leads", icon: Profile2User },
  {
    href: "/dashboard/campaigns",
    label: "Campaigns",
    icon: DirectNotification,
  },
  { href: "/dashboard/templates", label: "Templates", icon: DocumentText },
  { href: "/dashboard/messages", label: "Messages", icon: MessageText },
  { href: "/dashboard/conversations", label: "Conversations", icon: Sms },
  { href: "/dashboard/analytics", label: "Analytics", icon: Graph },
  { href: "/dashboard/settings", label: "Settings", icon: Setting2 },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      style={{
        width: "15rem",
        flexShrink: 0,
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-outline-variant)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: "4rem",
          padding: "0 1.25rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <LogoIcon
              size={25}
              color="var(--color-primary)"
              strokeWidth={2.1}
            />
          </div>
          <span
            style={{
              fontWeight: 700,
              color: "var(--color-on-surface)",
              fontSize: "var(--font-title-medium-size)",
            }}
          >
            Send Signal
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav
        style={{ flex: 1, padding: "0.75rem 0.625rem" }}
        aria-label="Main navigation"
      >
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.125rem",
          }}
        >
          {NAV_ITEMS.map(({ href, label, icon: IconComponent, exact }) => {
            const active = isActive(href, exact);
            return (
              <li key={href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={href}
                  className="sidebar-nav-item"
                  data-active={active}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    height: "48px",
                    padding: "0 0.9375rem",
                    borderRadius: "0.5rem",
                    textDecoration: "none",
                    fontSize: "var(--font-body-medium-size)",
                    fontWeight: active ? 600 : 400,
                  }}
                  aria-current={active ? "page" : undefined}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "1.25rem",
                      height: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    <IconComponent
                      size="20"
                      color="currentColor"
                      variant="Linear"
                    />
                  </span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
