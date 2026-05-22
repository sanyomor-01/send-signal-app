"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Textarea } from "@/components/ui/Form";

export default function CreateTemplatePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, body }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to create template");
        return;
      }
      router.push("/dashboard/templates");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "44rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1.5rem" }}>
        Create template
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField id="template-name" label="Template name" required>
          <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField id="template-body" label="Message body" required hint="Use placeholders like {firstName}, {lastName}, {fullName}, and {source}.">
          <Textarea id="template-body" rows={8} value={body} onChange={(e) => setBody(e.target.value)} required />
        </FormField>
        {error && <p style={{ color: "var(--color-error)", margin: 0 }}>{error}</p>}
        <div>
          <Button variant="primary" loading={loading} disabled={!name.trim() || !body.trim()} onClick={submit}>
            Create template
          </Button>
        </div>
      </div>
    </div>
  );
}
