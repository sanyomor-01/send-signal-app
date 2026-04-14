import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EmptyState, EMPTY_STATES } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session) return null;

  const campaigns = await prisma.campaign.findMany({
    where: {
      userId: session.userId,
      deletedAt: null,
      status: { not: "DRAFT" },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      status: true,
      totalRecipients: true,
      totalSent: true,
      totalDelivered: true,
      totalRead: true,
      totalReplied: true,
      totalConverted: true,
      totalFailed: true,
      totalUnsubscribed: true,
      startedAt: true,
    },
  });

  const totals = campaigns.reduce(
    (
      acc: {
        sent: number;
        delivered: number;
        read: number;
        replied: number;
        converted: number;
        failed: number;
      },
      c,
    ) => ({
      sent: acc.sent + c.totalSent,
      delivered: acc.delivered + c.totalDelivered,
      read: acc.read + c.totalRead,
      replied: acc.replied + c.totalReplied,
      converted: acc.converted + c.totalConverted,
      failed: acc.failed + c.totalFailed,
    }),
    { sent: 0, delivered: 0, read: 0, replied: 0, converted: 0, failed: 0 },
  );

  const deliveryRate =
    totals.sent > 0 ? ((totals.delivered / totals.sent) * 100).toFixed(1) : "0";
  const readRate =
    totals.delivered > 0
      ? ((totals.read / totals.delivered) * 100).toFixed(1)
      : "0";
  const replyRate =
    totals.read > 0 ? ((totals.replied / totals.read) * 100).toFixed(1) : "0";

  return (
    <div style={{ padding: "2rem", maxWidth: "72rem" }}>
      <h1
        style={{
          fontSize: "var(--font-headline-large-size)",
          fontWeight: 500,
          color: "var(--color-on-surface)",
          margin: "0 0 1.5rem",
        }}
      >
        Analytics
      </h1>

      {campaigns.length === 0 ? (
        <div
          style={{
            borderRadius: "0.75rem",
            border: "1px solid var(--color-outline-variant)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <EmptyState
            {...EMPTY_STATES.analytics}
            action={{
              label: "Create campaign",
              href: "/dashboard/campaigns/create",
            }}
          />
        </div>
      ) : (
        <>
          {/* Summary cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {[
              {
                label: "Total sent",
                value: totals.sent.toLocaleString(),
                color: "var(--color-primary)",
              },
              {
                label: "Delivered",
                value: totals.delivered.toLocaleString(),
                sub: `${deliveryRate}%`,
                color: "var(--color-success)",
              },
              {
                label: "Read",
                value: totals.read.toLocaleString(),
                sub: `${readRate}% read rate`,
                color: "var(--color-info)",
              },
              {
                label: "Replied",
                value: totals.replied.toLocaleString(),
                sub: `${replyRate}% reply rate`,
                color: "var(--color-secondary)",
              },
              {
                label: "Converted",
                value: totals.converted.toLocaleString(),
                color: "var(--color-success)",
              },
              {
                label: "Failed",
                value: totals.failed.toLocaleString(),
                color: "var(--color-error)",
              },
            ].map(({ label, value, sub, color }) => (
              <div
                key={label}
                style={{
                  padding: "1.25rem",
                  borderRadius: "0.75rem",
                  border: "1px solid var(--color-outline-variant)",
                  backgroundColor: "var(--color-surface)",
                }}
              >
                <div
                  style={{
                    fontSize: "var(--font-headline-small-size)",
                    fontWeight: 700,
                    color,
                    lineHeight: 1,
                    marginBottom: "0.375rem",
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: "var(--font-label-medium-size)",
                    color: "var(--color-on-surface-variant)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
                {sub && (
                  <div
                    style={{
                      fontSize: "var(--font-label-small-size)",
                      color: "var(--color-on-surface-variant)",
                      marginTop: "0.25rem",
                    }}
                  >
                    {sub}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Per-campaign breakdown */}
          <div
            style={{
              borderRadius: "0.75rem",
              border: "1px solid var(--color-outline-variant)",
              overflow: "hidden",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <div
              style={{
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--color-outline-variant)",
                fontWeight: 600,
                color: "var(--color-on-surface)",
                fontSize: "var(--font-title-medium-size)",
              }}
            >
              Campaign breakdown
            </div>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "var(--font-body-medium-size)",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "var(--color-surface-container)",
                    }}
                  >
                    {[
                      "Campaign",
                      "Sent",
                      "Delivered %",
                      "Read %",
                      "Replied %",
                      "Failed",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "0.75rem 1rem",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--color-on-surface-variant)",
                          fontSize: "var(--font-label-large-size)",
                          borderBottom:
                            "1px solid var(--color-outline-variant)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c, i) => {
                    const dr =
                      c.totalSent > 0
                        ? ((c.totalDelivered / c.totalSent) * 100).toFixed(0) +
                          "%"
                        : "—";
                    const rr =
                      c.totalDelivered > 0
                        ? ((c.totalRead / c.totalDelivered) * 100).toFixed(0) +
                          "%"
                        : "—";
                    const rep =
                      c.totalRead > 0
                        ? ((c.totalReplied / c.totalRead) * 100).toFixed(0) +
                          "%"
                        : "—";
                    return (
                      <tr
                        key={c.id}
                        style={{
                          borderTop:
                            i > 0
                              ? "1px solid var(--color-outline-variant)"
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            fontWeight: 500,
                            color: "var(--color-on-surface)",
                          }}
                        >
                          {c.name}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--color-on-surface)",
                          }}
                        >
                          {c.totalSent}/{c.totalRecipients}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--color-success)",
                            fontWeight: 600,
                          }}
                        >
                          {dr}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--color-info)",
                            fontWeight: 600,
                          }}
                        >
                          {rr}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--color-secondary)",
                            fontWeight: 600,
                          }}
                        >
                          {rep}
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 1rem",
                            color: "var(--color-error)",
                          }}
                        >
                          {c.totalFailed}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
