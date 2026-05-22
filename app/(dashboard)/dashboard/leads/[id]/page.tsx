import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/Badge";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;
  const lead = await prisma.lead.findFirst({
    where: { id, userId: session.userId, deletedAt: null },
    include: { messages: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!lead) notFound();

  return (
    <div style={{ padding: "2rem", maxWidth: "56rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 0.75rem" }}>
        {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.phoneNumber}
      </h1>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1.5rem" }}>
        <Badge status={lead.status} size="sm" />
        <span>{lead.phoneNumber}</span>
        {lead.email && <span>{lead.email}</span>}
      </div>
      <h2 style={{ fontSize: "var(--font-title-medium-size)", margin: "0 0 0.75rem" }}>Recent messages</h2>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {lead.messages.map((message) => (
          <div key={message.id} style={{ border: "1px solid var(--color-outline-variant)", borderRadius: "0.5rem", padding: "0.875rem" }}>
            <strong>{message.direction}</strong> <Badge status={message.status} size="sm" />
            <p style={{ margin: "0.5rem 0 0" }}>{message.renderedBody ?? message.failureReason ?? "No message body"}</p>
          </div>
        ))}
        {lead.messages.length === 0 && <p>No messages yet.</p>}
      </div>
    </div>
  );
}
