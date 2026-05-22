import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ConversationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;
  const conversation = await prisma.conversation.findFirst({
    where: { id, userId: session.userId },
    include: {
      lead: { select: { firstName: true, lastName: true, phoneNumber: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!conversation) notFound();

  const leadName = [conversation.lead.firstName, conversation.lead.lastName].filter(Boolean).join(" ") || conversation.lead.phoneNumber;

  return (
    <div style={{ padding: "2rem", maxWidth: "44rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1rem" }}>
        {leadName}
      </h1>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {conversation.messages.map((message) => (
          <div key={message.id} style={{ border: "1px solid var(--color-outline-variant)", borderRadius: "0.5rem", padding: "0.875rem" }}>
            <strong>{message.direction === "OUTBOUND" ? "You" : leadName}</strong>
            <p style={{ margin: "0.5rem 0 0", whiteSpace: "pre-wrap" }}>{message.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
