"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type ImportResult = {
  imported: number;
  duplicates: number;
  invalid: number;
  invalidRows: Array<{ row: number; phone: string; reason: string }>;
};

export default function ImportLeadsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/leads/import", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error ?? "Import failed");
        return;
      }
      setResult(json.data);
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "44rem" }}>
      <h1 style={{ fontSize: "var(--font-title-large-size)", fontWeight: 500, margin: "0 0 1.5rem" }}>
        Import leads
      </h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          style={{ fontSize: "var(--font-body-medium-size)" }}
        />
        {error && <p style={{ color: "var(--color-error)", margin: 0 }}>{error}</p>}
        <div>
          <Button variant="primary" loading={loading} disabled={!file} onClick={upload}>
            Import CSV
          </Button>
        </div>
        {result && (
          <div style={{ border: "1px solid var(--color-outline-variant)", borderRadius: "0.5rem", padding: "1rem" }}>
            <p style={{ margin: 0 }}>
              Imported {result.imported}, skipped {result.duplicates} duplicates, found {result.invalid} invalid rows.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
