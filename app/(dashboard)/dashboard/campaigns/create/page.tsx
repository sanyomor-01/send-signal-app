"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/Form";

type Account = { id: string; accountName: string; displayPhoneNumber: string | null };
type Template = { id: string; name: string };
type Lead = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string;
  optIn: boolean;
  unsubscribed: boolean;
};

export default function CreateCampaignPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsappAccountId, setWhatsappAccountId] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    async function load() {
      try {
        const [accountsRes, templatesRes, leadsRes] = await Promise.all([
          fetch("/api/whatsapp-accounts", { signal: controller.signal }),
          fetch("/api/templates?pageSize=100", { signal: controller.signal }),
          fetch("/api/leads?pageSize=100", { signal: controller.signal }),
        ]);
        const [accountsJson, templatesJson, leadsJson] = await Promise.all([
          accountsRes.json(),
          templatesRes.json(),
          leadsRes.json(),
        ]);
        if (!mounted) return;
        setAccounts(accountsJson.data ?? []);
        setTemplates(templatesJson.data?.items ?? []);
        setLeads(leadsJson.data?.items ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError("Could not load campaign setup data.");
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          whatsappAccountId,
          templateId,
          leadIds: selectedLeadIds,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Failed to create campaign");
        return;
      }
      router.push("/dashboard/campaigns");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const eligibleLeads = leads.filter((lead) => lead.optIn && !lead.unsubscribed);

  return (
    <div style={{ padding: "2rem", maxWidth: "52rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1.5rem" }}>
        Create campaign
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField id="campaign-name" label="Campaign name" required>
          <Input id="campaign-name" value={name} onChange={(e) => setName(e.target.value)} required />
        </FormField>
        <FormField id="campaign-description" label="Description">
          <Textarea id="campaign-description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormField>
        <FormField id="whatsapp-account" label="WhatsApp account" required>
          <Select id="whatsapp-account" value={whatsappAccountId} onChange={(e) => setWhatsappAccountId(e.target.value)}>
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.accountName} {account.displayPhoneNumber ? `(${account.displayPhoneNumber})` : ""}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField id="template" label="Template" required>
          <Select id="template" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </Select>
        </FormField>
        <div style={{ border: "1px solid var(--color-outline-variant)", borderRadius: "0.5rem", padding: "1rem" }}>
          <p style={{ margin: "0 0 0.75rem", fontWeight: 600 }}>Recipients ({selectedLeadIds.length})</p>
          <div style={{ display: "grid", gap: "0.5rem", maxHeight: "16rem", overflowY: "auto" }}>
            {eligibleLeads.map((lead) => {
              const label = [lead.firstName, lead.lastName].filter(Boolean).join(" ") || lead.phoneNumber;
              return (
                <label key={lead.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={(e) => {
                      setSelectedLeadIds((current) =>
                        e.target.checked ? [...current, lead.id] : current.filter((id) => id !== lead.id),
                      );
                    }}
                  />
                  <span>{label}</span>
                </label>
              );
            })}
            {eligibleLeads.length === 0 && (
              <p style={{ margin: 0, color: "var(--color-on-surface-variant)" }}>No opted-in leads available.</p>
            )}
          </div>
        </div>
        {error && <p style={{ color: "var(--color-error)", margin: 0 }}>{error}</p>}
        <div>
          <Button
            variant="primary"
            loading={loading}
            disabled={!name.trim() || !whatsappAccountId || !templateId}
            onClick={submit}
          >
            Create campaign
          </Button>
        </div>
      </div>
    </div>
  );
}
