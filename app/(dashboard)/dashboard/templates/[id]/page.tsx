import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;
  const template = await prisma.template.findFirst({
    where: { id, userId: session.userId, deletedAt: null },
  });
  if (!template) notFound();

  return (
    <div style={{ padding: "2rem", maxWidth: "44rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1rem" }}>
        {template.name}
      </h1>
      <div style={{ whiteSpace: "pre-wrap", border: "1px solid var(--color-outline-variant)", borderRadius: "0.5rem", padding: "1rem" }}>
        {template.body}
      </div>
    </div>
  );
}
