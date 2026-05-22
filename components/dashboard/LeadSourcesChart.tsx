"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "./DashboardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrendUp } from "iconsax-react";

interface LeadSourcesChartProps {
  data: Array<{ name: string; value: number }>;
}

const COLORS = ["#FF5B04", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6"];

export function LeadSourcesChart({ data }: LeadSourcesChartProps) {
  if (!data || data.length === 0) {
    return (
      <DashboardCard>
        <EmptyState
          icon={<TrendUp size={40} color="var(--color-primary)" />}
          title="No lead sources yet"
          description="Import leads to see them categorized by source"
          action={{ label: "Import Leads", href: "/dashboard/leads/import" }}
        />
      </DashboardCard>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <DashboardCard>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {/* Chart */}
        <div style={{ height: "250px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid var(--color-outline-variant)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
                labelStyle={{ color: "var(--color-on-surface)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with percentages */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {data.map((item, index) => (
            <div
              key={item.name}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              <div
                style={{
                  width: "0.75rem",
                  height: "0.75rem",
                  borderRadius: "50%",
                  backgroundColor: COLORS[index % COLORS.length],
                }}
              />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "var(--font-body-medium-size)",
                    color: "var(--color-on-surface)",
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </p>
                <p
                  style={{
                    fontSize: "var(--font-label-small-size)",
                    color: "var(--color-on-surface-variant)",
                    margin: 0,
                  }}
                >
                  {item.value} leads • {Math.round((item.value / total) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardCard>
  );
}
