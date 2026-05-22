"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { signOut } from "@/app/(auth)/actions";
import {
  MessageQuestion,
  Notification,
  SearchNormal1,
  Warning2,
} from "iconsax-react";

type DashboardHeaderProps = {
  fullName: string | null;
  email: string;
  whatsappConnection: {
    isConnected: boolean;
    phoneNumber: string | null;
  };
};

function getInitials(name: string | null, email: string): string {
  if (name && name.trim()) {
    return name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }
  return email[0].toUpperCase();
}

export function DashboardHeader({
  fullName,
  email,
  whatsappConnection,
}: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchHovered, setIsSearchHovered] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = fullName || email.split("@")[0];
  const initials = getInitials(fullName, email);
  const searchBorderColor = isSearchFocused
    ? "var(--color-primary)"
    : isSearchHovered
      ? "var(--color-outline-normal)"
      : "var(--color-outline-variant)";
  const searchHasText = searchValue.trim().length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header
      style={{
        height: "4rem",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        padding: "0 1.5rem",
        borderBottom: "1px solid var(--color-outline-variant)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {/* Search */}
      <div
        style={{
          position: "relative",
          width: "min(24rem, 38vw)",
          minWidth: "12rem",
          flexShrink: 0,
        }}
      >
        <SearchNormal1
          size={18}
          color="var(--color-on-surface-variant)"
          style={{
            position: "absolute",
            left: "0.875rem",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <input
          type="search"
          aria-label="Search dashboard"
          placeholder="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          onMouseEnter={() => setIsSearchHovered(true)}
          onMouseLeave={() => setIsSearchHovered(false)}
          style={{
            width: "100%",
            height: "2.5rem",
            padding: "0 0.875rem 0 2.75rem",
            borderRadius: "0.5rem",
            border: `1.5px solid ${searchBorderColor}`,
            backgroundColor: "var(--color-surface-container)",
            color: "var(--color-on-surface)",
            fontSize: "var(--font-body-medium-size)",
            fontFamily: "inherit",
            outline: "none",
            boxShadow: searchHasText
              ? `0 0 0 3px color-mix(in srgb, ${searchBorderColor} 20%, transparent), 0 0 14px color-mix(in srgb, ${searchBorderColor} 28%, transparent)`
              : "none",
            transition:
              "border-color 0.15s ease, box-shadow 0.18s ease, background-color 0.15s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: "0.75rem",
          minWidth: 0,
          flex: 1,
        }}
      >
        {/* WhatsApp connection status */}
        {whatsappConnection.isConnected ? (
          <div
            aria-label="WhatsApp Connected"
            style={{
              minHeight: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.375rem 0.75rem",
              borderRadius: "8px",
              border: "1px solid rgba(34, 197, 94, 0.28)",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              color: "var(--color-on-surface)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "50%",
                backgroundColor: "#22c55e",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.15,
              }}
            >
              <span
                style={{
                  fontSize: "var(--font-label-medium-size)",
                  fontWeight: 500,
                  color: "#15803d",
                }}
              >
                WhatsApp Connected
              </span>
              {whatsappConnection.phoneNumber && (
                <span
                  style={{
                    fontSize: "var(--font-label-small-size)",
                    color: "var(--color-on-surface-variant)",
                  }}
                >
                  {whatsappConnection.phoneNumber}
                </span>
              )}
            </span>
          </div>
        ) : (
          <div
            aria-label="WhatsApp not connected"
            style={{
              minHeight: "2.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.375rem 0.5rem 0.375rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(245, 158, 11, 0.36)",
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              whiteSpace: "nowrap",
            }}
          >
            <Warning2 size={16} color="#b45309" variant="Bold" />
            <span
              style={{
                fontSize: "var(--font-label-large-size)",
                fontWeight: 700,
                color: "#92400e",
              }}
            >
              WhatsApp not connected.
            </span>
            <Link
              href="/onboarding"
              style={{
                padding: "0.375rem 0.625rem",
                borderRadius: "999px",
                backgroundColor: "var(--color-primary)",
                color: "var(--color-on-primary)",
                fontSize: "var(--font-label-medium-size)",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Connect Now
            </Link>
          </div>
        )}

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.5rem",

            backgroundColor: "var(--color-surface)",
            color: "var(--color-on-surface-variant)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <Notification size={20} color="currentColor" />
        </button>

        <button
          type="button"
          aria-label="Help"
          title="Help"
          style={{
            width: "2.5rem",
            height: "2.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "var(--color-surface)",
            color: "var(--color-on-surface-variant)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <MessageQuestion size={20} color="currentColor" />
        </button>

        {/* Profile trigger */}
        <div
          ref={dropdownRef}
          style={{ position: "relative", zIndex: isOpen ? 1000 : undefined }}
        >
          {/* Overlay backdrop when open */}
          {isOpen && (
            <div
              id="profile-overlay"
              onClick={() => setIsOpen(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(15, 23, 42, 0.3)", // mild overlay
                backdropFilter: "blur(4px)", // premium styling guidelines!
                zIndex: 999,
                animation: "profileOverlayFadeIn 0.2s ease-out",
              }}
            />
          )}

          <button
            id="profile-menu-trigger"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.625rem",
              padding: "0.375rem 0.5rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
              position: "relative",
              zIndex: isOpen ? 1001 : undefined,
            }}
          >
            {/* Name */}
            <span
              style={{
                fontSize: "var(--font-body-medium-size)",
                fontWeight: 500,
                color: "var(--color-on-surface)",
                maxWidth: "10rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </span>
            {/* Avatar */}
            <div
              style={{
                width: "2.5rem",
                height: "2.5rem",
                borderRadius: "50%",
                border: "1.5px solid var(--color-outline-normal)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "var(--color-on-surface)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                {initials}
              </span>
            </div>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              id="profile-dropdown"
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                minWidth: "14rem",
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "0.75rem",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)",
                zIndex: 1000,
                overflow: "hidden",
                animation: "profileDropdownIn 0.15s ease-out",
              }}
            >
              {/* User info */}
              <div
                style={{
                  padding: "0.875rem 1rem",
                  borderBottom: "1px solid var(--color-outline-variant)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      border: "1.5px solid var(--color-outline-normal)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "var(--color-on-surface)",
                        lineHeight: 1,
                      }}
                    >
                      {initials}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: "var(--font-body-medium-size)",
                        color: "var(--color-on-surface)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayName}
                    </p>
                    <p
                      style={{
                        margin: "0.125rem 0 0",
                        fontSize: "var(--font-label-medium-size)",
                        color: "var(--color-on-surface-variant)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <div style={{ padding: "0.375rem" }}>
                <form action={signOut}>
                  <button
                    id="sign-out-btn"
                    type="submit"
                    role="menuitem"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      fontSize: "var(--font-body-medium-size)",
                      color: "var(--color-error, #d32f2f)",
                      textAlign: "left",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--color-error-container, #fce4ec)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes profileDropdownIn {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes profileOverlayFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
