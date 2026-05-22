"use client";

import { Fragment } from "react";

interface ProgressStep {
  id: number;
  label: string;
  completed: boolean;
  current: boolean;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.current));
  const hasCurrent = steps.some((step) => step.current);

  return (
    <div
      style={{
        borderRadius: "0.75rem",
        border: "1px solid var(--color-outline-variant)",
        backgroundColor: "white",
        padding: "1.5rem",
        marginBottom: "2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: "1 1 16rem", minWidth: 0 }}>
        <h3
          style={{
            fontSize: "var(--font-title-medium-size)",
            fontWeight: 600,
            color: "var(--color-on-surface)",
            margin: 0,
            marginBottom: "0.375rem",
          }}
        >
          Get Started
        </h3>
        <p
          style={{
            fontSize: "var(--font-body-medium-size)",
            color: "var(--color-on-surface-variant)",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          Complete these steps to launch your first campaign.
        </p>
      </div>

      <div style={{ flex: "1.6 1 28rem", minWidth: "20rem" }}>
        <div
          aria-label="Setup progress"
          style={{
            display: "flex",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {steps.map((step, index) => {
            const isCompleted = step.completed;
            const isCurrent =
              step.current || (!hasCurrent && index === currentIndex);
            const isUpcoming = !isCompleted && !isCurrent;

            let bgColor = "var(--color-surface-container-highest)";
            let textColor = "var(--color-on-surface-variant)";
            const borderColor = "var(--color-outline-variant)";

            if (isCompleted) {
              bgColor = "var(--color-success)";
              textColor = "var(--color-on-success)";
            } else if (isCurrent) {
              bgColor = "var(--color-surface)";
              textColor = "var(--color-primary)";
            }

            return (
              <Fragment key={step.id}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "5.25rem",
                    minWidth: 0,
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      backgroundColor: bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: textColor,
                      border: isCurrent
                        ? "1.5px solid var(--color-primary)"
                        : isUpcoming
                          ? `1px solid ${borderColor}`
                          : "none",
                      flexShrink: 0,
                    }}
                  >
                    {isCompleted ? (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: "var(--font-label-small-size)",
                      fontWeight: isCurrent ? 600 : 500,
                      color:
                        isCompleted || isCurrent
                          ? "var(--color-on-surface)"
                          : "var(--color-on-surface-variant)",
                      lineHeight: 1.25,
                      marginTop: "0.5rem",
                      textAlign: "center",
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {index < steps.length - 1 && (
                  <div
                    style={{
                      flex: 1,
                      minWidth: "1rem",
                      height: "1px",
                      backgroundColor: isCompleted
                        ? "var(--color-success)"
                        : "var(--color-outline-variant)",
                      margin: "10px 0.5rem 0",
                    }}
                  />
                )}
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
