import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;
  const campaign = await prisma.campaign.findFirst({
    where: { id, userId: session.userId, deletedAt: null },
    include: {
      template: { select: { name: true, body: true } },
      campaignLeads: { take: 25, include: { lead: { select: { firstName: true, lastName: true, phoneNumber: true } } } },
    },
  });
  if (!campaign) notFound();

  return (
    <div style={{ padding: "2rem", maxWidth: "64rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 0.75rem" }}>
        {campaign.name}
      </h1>
      <div style={{ marginBottom: "1.5rem" }}>
        <Badge status={campaign.status} size="sm" />
      </div>
      <p>Template: {campaign.template.name}</p>
      <p>
        Sent {campaign.totalSent} of {campaign.totalRecipients}. Delivered {campaign.totalDelivered}. Replied {campaign.totalReplied}.
      </p>
      <h2 style={{ fontSize: "var(--font-title-medium-size)", marginTop: "2rem" }}>Recipients</h2>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {campaign.campaignLeads.map((campaignLead) => (
          <div key={campaignLead.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--color-outline-variant)", padding: "0.5rem 0" }}>
            <span>{[campaignLead.lead.firstName, campaignLead.lead.lastName].filter(Boolean).join(" ") || campaignLead.lead.phoneNumber}</span>
            <Badge status={campaignLead.status} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
