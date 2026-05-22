import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { WelcomeSection } from "@/components/dashboard/WelcomeSection";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { ActivityItem } from "@/components/dashboard/ActivityItem";
import { QuickActionItem } from "@/components/dashboard/QuickActionItem";
import { ProgressTracker } from "@/components/dashboard/ProgressTracker";
import { WhatsAppConnectionCard } from "@/components/dashboard/WhatsAppConnectionCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { LeadSourcesChart } from "@/components/dashboard/LeadSourcesChart";
import {
  DirectNotification,
  Send2,
  Eye,
  TickCircle,
  MessageCircle,
  Import,
  DocumentText,
  Send,
  MessageText as MessageTextIcon,
  Sms,
  TrendUp,
} from "iconsax-react";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const userRecord = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { fullName: true },
  });

  // Comprehensive data fetching
  const [
    totalLeads,
    totalCampaigns,
    recentLogs,
    topCampaigns,
    messageStats,
    recentReplies,
    whatsappAccount,
    completedOnboarding,
  ] = await Promise.all([
    prisma.lead.count({ where: { userId: session.userId, deletedAt: null } }),
    prisma.campaign.count({
      where: { userId: session.userId, deletedAt: null },
    }),
    prisma.activityLog.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        lead: {
          select: { firstName: true, lastName: true, phoneNumber: true },
        },
      },
    }),
    prisma.campaign.findMany({
      where: {
        userId: session.userId,
        status: { in: ["RUNNING", "SCHEDULED", "PAUSED", "COMPLETED"] },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        template: { select: { name: true } },
      },
    }),
    prisma.message.groupBy({
      by: ["status"],
      where: {
        userId: session.userId,
        direction: "OUTBOUND",
      },
      _count: true,
    }),
    prisma.conversation.findMany({
      where: { userId: session.userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
      include: {
        lead: {
          select: { firstName: true, lastName: true, phoneNumber: true },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, direction: true },
        },
      },
    }),
    prisma.whatsappAccount.findFirst({
      where: { userId: session.userId, isActive: true },
      select: {
        displayPhoneNumber: true,
        isActive: true,
      },
    }),
    // Check if user has completed the onboarding
    prisma.template.findFirst({
      where: { userId: session.userId, deletedAt: null },
      select: { id: true },
    }),
  ]);

  // Calculate metrics
  const totalMessagesSent =
    messageStats.find((s) => s.status === "SENT")?._count || 0;
  const totalDelivered =
    messageStats.find((s) => s.status === "DELIVERED")?._count || 0;
  const totalRead = messageStats.find((s) => s.status === "READ")?._count || 0;
  const totalReplies =
    messageStats.find((s) => s.status === "REPLIED")?._count || 0;

  const deliveryRate =
    totalMessagesSent > 0
      ? Math.round(((totalDelivered + totalRead) / totalMessagesSent) * 100)
      : 0;
  const readRate =
    totalDelivered > 0 ? Math.round((totalRead / totalDelivered) * 100) : 0;
  const replyRate =
    totalDelivered > 0 ? Math.round((totalReplies / totalDelivered) * 100) : 0;

  // Determine onboarding progress
  const hasWhatsappAccount = !!whatsappAccount;
  const hasImportedLeads = totalLeads > 0;
  const hasTemplate = !!completedOnboarding;
  const hasCampaign = totalCampaigns > 0;

  const onboardingSteps = [
    { id: 1, label: "Create account", completed: true, current: false },
    {
      id: 2,
      label: "Connect WhatsApp",
      completed: hasWhatsappAccount,
      current: !hasWhatsappAccount,
    },
    {
      id: 3,
      label: "Import leads",
      completed: hasImportedLeads,
      current: hasWhatsappAccount && !hasImportedLeads,
    },
    {
      id: 4,
      label: "Create template",
      completed: hasTemplate,
      current: hasWhatsappAccount && hasImportedLeads && !hasTemplate,
    },
    {
      id: 5,
      label: "Send first campaign",
      completed: hasCampaign,
      current:
        hasWhatsappAccount && hasImportedLeads && hasTemplate && !hasCampaign,
    },
  ];

  const onboardingComplete = onboardingSteps.every((s) => s.completed);

  // Get lead sources (from leads with source field)
  const leadsBySource = await prisma.lead.groupBy({
    by: ["source"],
    where: { userId: session.userId, deletedAt: null, source: { not: null } },
    _count: true,
  });

  const leadSourcesData = leadsBySource
    .sort((a, b) => b._count - a._count)
    .slice(0, 5)
    .map((item) => ({
      name: item.source || "Other",
      value: item._count,
    }));

  return (
    <div
      style={{
        padding: "1.5rem 2rem 2rem",
        backgroundColor: "#FAFAFA",
        minHeight: "100vh",
      }}
    >
      {/* Welcome Section */}
      <WelcomeSection userName={userRecord?.fullName} />

      {/* Onboarding Progress - only show if not completed */}
      {!onboardingComplete && <ProgressTracker steps={onboardingSteps} />}

      {/* Main Content Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 380px",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
        className="dashboard-grid"
      >
        {/* Left Column - Main Content */}
        <div>
          {/* KPI Metrics */}
          <div style={{ marginBottom: "2rem" }}>
            <SectionHeader title="Key Metrics" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <MetricCard
                icon={<Send2 size={20} color="var(--color-primary)" />}
                label="Messages Sent"
                value={totalMessagesSent.toLocaleString()}
                trend={{
                  percentage: 12,
                  period: "from last week",
                }}
              />
              <MetricCard
                icon={<TickCircle size={20} color="var(--color-primary)" />}
                label="Delivery Rate"
                value={`${deliveryRate}%`}
                trend={{
                  percentage: 2.4,
                  period: "from last week",
                }}
              />
              <MetricCard
                icon={<Eye size={20} color="var(--color-primary)" />}
                label="Read Rate"
                value={`${readRate}%`}
                trend={{
                  percentage: 5.7,
                  period: "from last week",
                }}
              />
              <MetricCard
                icon={<MessageCircle size={20} color="var(--color-primary)" />}
                label="Reply Rate"
                value={`${replyRate}%`}
                trend={{
                  percentage: 3.1,
                  period: "from last week",
                }}
              />
            </div>
          </div>

          {/* Analytics Chart */}
          <div style={{ marginBottom: "2rem" }}>
            <SectionHeader title="Messages Sent Over Time" />
            <AnalyticsChart />
          </div>

          {/* Top Campaigns */}
          <div style={{ marginBottom: "2rem" }}>
            <SectionHeader
              title="Top Campaigns"
              action={{ label: "View all", href: "/dashboard/campaigns" }}
            />
            <DashboardCard>
              {topCampaigns.length === 0 ? (
                <EmptyState
                  icon={
                    <DirectNotification
                      size={40}
                      color="var(--color-primary)"
                    />
                  }
                  title="No campaigns yet"
                  description="Create your first campaign to reach out to your leads"
                  action={{
                    label: "Create Campaign",
                    href: "/dashboard/campaigns/new",
                  }}
                />
              ) : (
                <div>
                  {topCampaigns.map((campaign, i) => (
                    <div
                      key={campaign.id}
                      style={{
                        paddingBottom:
                          i < topCampaigns.length - 1 ? "1rem" : "0",
                        borderBottom:
                          i < topCampaigns.length - 1
                            ? "1px solid var(--color-outline-variant)"
                            : "none",
                        marginBottom:
                          i < topCampaigns.length - 1 ? "1rem" : "0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "1rem",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "var(--font-body-large-size)",
                              fontWeight: 600,
                              color: "var(--color-on-surface)",
                              margin: "0 0 0.25rem 0",
                            }}
                          >
                            {campaign.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "var(--font-label-medium-size)",
                              color: "var(--color-on-surface-variant)",
                              margin: 0,
                            }}
                          >
                            Created{" "}
                            {new Date(campaign.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge status={campaign.status} size="sm" />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "1.5rem",
                          marginTop: "0.75rem",
                          fontSize: "var(--font-label-medium-size)",
                        }}
                      >
                        <span
                          style={{ color: "var(--color-on-surface-variant)" }}
                        >
                          <strong style={{ color: "var(--color-on-surface)" }}>
                            {campaign.totalSent}
                          </strong>{" "}
                          sent
                        </span>
                        <span style={{ color: "#3b82f6" }}>
                          <strong style={{ color: "#1e40af" }}>
                            {campaign.totalSent > 0
                              ? Math.round(
                                  (campaign.totalReplied / campaign.totalSent) *
                                    100,
                                )
                              : 0}
                            %
                          </strong>{" "}
                          reply rate
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Lead Sources Chart */}
          <div style={{ marginBottom: "2rem" }}>
            <SectionHeader title="Lead Sources" />
            <LeadSourcesChart data={leadSourcesData} />
          </div>

          {/* Recent Replies */}
          <div>
            <SectionHeader
              title="Recent Replies"
              action={{ label: "View all", href: "/dashboard/conversations" }}
            />
            <DashboardCard>
              {recentReplies.length === 0 ? (
                <EmptyState
                  icon={
                    <MessageTextIcon size={40} color="var(--color-primary)" />
                  }
                  title="No replies yet"
                  description="When leads reply to your messages, they'll appear here"
                  action={{
                    label: "View Conversations",
                    href: "/dashboard/conversations",
                  }}
                />
              ) : (
                <div>
                  {recentReplies.map((conv, i) => {
                    const lastMessage = conv.messages[0];
                    const leadName =
                      `${conv.lead?.firstName || "Unknown"} ${conv.lead?.lastName || ""}`.trim();

                    return (
                      <div
                        key={conv.id}
                        style={{
                          paddingBottom:
                            i < recentReplies.length - 1 ? "1rem" : "0",
                          borderBottom:
                            i < recentReplies.length - 1
                              ? "1px solid var(--color-outline-variant)"
                              : "none",
                          marginBottom:
                            i < recentReplies.length - 1 ? "1rem" : "0",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: "1rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <div>
                            <h4
                              style={{
                                fontSize: "var(--font-body-large-size)",
                                fontWeight: 600,
                                color: "var(--color-on-surface)",
                                margin: 0,
                              }}
                            >
                              {leadName}
                            </h4>
                            <p
                              style={{
                                fontSize: "var(--font-label-small-size)",
                                color: "var(--color-on-surface-variant)",
                                margin: 0,
                              }}
                            >
                              {conv.lead?.phoneNumber}
                            </p>
                          </div>
                          <Badge status="REPLIED" size="sm" />
                        </div>
                        {lastMessage && (
                          <p
                            style={{
                              fontSize: "var(--font-body-medium-size)",
                              color: "var(--color-on-surface-variant)",
                              margin: "0.5rem 0 0 0",
                              fontStyle: "italic",
                            }}
                          >
                            &ldquo;{lastMessage.body.substring(0, 80)}
                            {lastMessage.body.length > 80 ? "..." : ""}&rdquo;
                          </p>
                        )}
                        <span
                          style={{
                            fontSize: "var(--font-label-small-size)",
                            color: "var(--color-on-surface-variant)",
                            display: "inline-block",
                            marginTop: "0.5rem",
                          }}
                        >
                          {new Date(conv.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* WhatsApp Connection Card */}
          <div style={{ marginBottom: "1.5rem" }}>
            <WhatsAppConnectionCard
              isConnected={!!whatsappAccount}
              phoneNumber={whatsappAccount?.displayPhoneNumber ?? undefined}
              qualityRating="Excellent"
            />
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: "1.5rem" }}>
            <SectionHeader title="Quick Actions" />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <QuickActionItem
                icon={<Import size={18} />}
                label="Import Leads"
                href="/dashboard/leads/import"
              />
              <QuickActionItem
                icon={<DocumentText size={18} />}
                label="Create Template"
                href="/dashboard/templates/new"
              />
              <QuickActionItem
                icon={<Send size={18} />}
                label="Send Test Message"
              />
              <QuickActionItem
                icon={<Sms size={18} />}
                label="View Conversations"
                href="/dashboard/conversations"
              />
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div>
            <SectionHeader title="Recent Activity" />
            <DashboardCard noPadding>
              {recentLogs.length === 0 ? (
                <div style={{ padding: "2rem 1.5rem" }}>
                  <EmptyState
                    icon={<TrendUp size={32} color="var(--color-primary)" />}
                    title="No activity yet"
                    description="Your recent actions will appear here"
                  />
                </div>
              ) : (
                <div style={{ padding: "1rem" }}>
                  {recentLogs.map((log, i) => (
                    <div
                      key={log.id}
                      style={{
                        marginBottom: i < recentLogs.length - 1 ? "1rem" : "0",
                      }}
                    >
                      <ActivityItem
                        icon={<TrendUp size={16} />}
                        title={log.description}
                        timestamp={new Date(log.createdAt).toLocaleString()}
                        color="success"
                      />
                    </div>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
}
