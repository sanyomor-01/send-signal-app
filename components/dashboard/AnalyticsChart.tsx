"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardCard } from "./DashboardCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { TrendUp } from "iconsax-react";

interface ChartData {
  date: string;
  sent: number;
  delivered: number;
  replied: number;
}

export function AnalyticsChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let mounted = true;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch("/api/analytics/overview", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const json = await res.json();
        const chartData: ChartData[] = json.data?.points ?? [];
        if (!mounted) return;
        setData(chartData);
        setHasData(chartData.some((d) => d.sent > 0));
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Failed to fetch analytics:", error);
        if (mounted) setHasData(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAnalytics();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <DashboardCard>
        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ color: "var(--color-on-surface-variant)" }}>
            Loading chart...
          </div>
        </div>
      </DashboardCard>
    );
  }

  if (!hasData) {
    return (
      <DashboardCard>
        <EmptyState
          icon={<TrendUp size={40} color="var(--color-primary)" />}
          title="No analytics yet"
          description="Send your first campaign to see analytics"
          action={{
            label: "Create Campaign",
            href: "/dashboard/campaigns/new",
          }}
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard>
      <div style={{ height: "300px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-outline-variant)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-on-surface-variant)"
              style={{ fontSize: "var(--font-label-small-size)" }}
            />
            <YAxis
              stroke="var(--color-on-surface-variant)"
              style={{ fontSize: "var(--font-label-small-size)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid var(--color-outline-variant)",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "var(--color-on-surface)" }}
            />
            <Line
              type="monotone"
              dataKey="sent"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
              name="Sent"
            />
            <Line
              type="monotone"
              dataKey="delivered"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
              name="Delivered"
            />
            <Line
              type="monotone"
              dataKey="replied"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Replied"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
}
