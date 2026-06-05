// Dashboard fiscal period configuration
// Stored in localStorage so it can be updated via the admin panel

export interface DashboardConfig {
  /** Current reporting month (e.g., "January") */
  currentMonth: string;
  /** Short month (e.g., "Jan") */
  currentMonthShort: string;
  /** The fiscal year-end years for the 3 YTD columns (e.g., [2024, 2025, 2026]) */
  ytdYears: [number, number, number];
  /** Number of months elapsed in the fiscal year (July = month 1) */
  monthsElapsed: number;
  /** Budget utilization threshold (decimal, e.g., 0.583 for 58.3%) */
  percentageThreshold: number;
}

import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "dashboard-fiscal-config";
const SINGLETON_ID = "singleton";

const DEFAULT_CONFIG: DashboardConfig = {
  currentMonth: "April",
  currentMonthShort: "Apr",
  ytdYears: [2024, 2025, 2026],
  monthsElapsed: 10,
  percentageThreshold: 0.8333,
};

export function getDashboardConfig(): DashboardConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn("Failed to read dashboard config from localStorage:", e);
  }
  return DEFAULT_CONFIG;
}

/** Fetch the shared config from the backend and cache to localStorage. */
export async function fetchDashboardConfig(): Promise<DashboardConfig> {
  try {
    const { data, error } = await supabase
      .from("dashboard_config")
      .select("*")
      .eq("id", SINGLETON_ID)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      const config: DashboardConfig = {
        currentMonth: data.current_month,
        currentMonthShort: data.current_month_short,
        ytdYears: data.ytd_years as [number, number, number],
        monthsElapsed: data.months_elapsed,
        percentageThreshold: Number(data.percentage_threshold),
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch {}
      return config;
    }
  } catch (e) {
    console.warn("Failed to fetch dashboard config from backend:", e);
  }
  return getDashboardConfig();
}

export async function saveDashboardConfig(config: DashboardConfig): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn("Failed to save dashboard config to localStorage:", e);
  }
  try {
    const { error } = await supabase
      .from("dashboard_config")
      .upsert({
        id: SINGLETON_ID,
        current_month: config.currentMonth,
        current_month_short: config.currentMonthShort,
        ytd_years: config.ytdYears,
        months_elapsed: config.monthsElapsed,
        percentage_threshold: config.percentageThreshold,
        updated_at: new Date().toISOString(),
      });
    if (error) throw error;
  } catch (e) {
    console.error("Failed to save dashboard config to backend:", e);
    throw e;
  }
}

/** Helper: "July - Jan 2026" */
export function getFiscalPeriodLabel(config?: DashboardConfig): string {
  const c = config ?? getDashboardConfig();
  return `July - ${c.currentMonthShort} ${c.ytdYears[2]}`;
}

/** Helper: "Through July - Jan 2026" */
export function getFiscalPeriodThroughLabel(config?: DashboardConfig): string {
  return `Through ${getFiscalPeriodLabel(config)}`;
}

/** Helper: "Jan 24 YTD", "Jan 25 YTD", "Jan 26 YTD" */
export function getYtdLabels(config?: DashboardConfig): [string, string, string] {
  const c = config ?? getDashboardConfig();
  return [
    `${c.currentMonthShort} ${String(c.ytdYears[0]).slice(-2)} YTD`,
    `${c.currentMonthShort} ${String(c.ytdYears[1]).slice(-2)} YTD`,
    `${c.currentMonthShort} ${String(c.ytdYears[2]).slice(-2)} YTD`,
  ];
}

/** Helper: "Jan26 vs Jan25" */
export function getChangeLabel(config?: DashboardConfig): string {
  const c = config ?? getDashboardConfig();
  return `${c.currentMonthShort}${String(c.ytdYears[2]).slice(-2)} vs ${c.currentMonthShort}${String(c.ytdYears[1]).slice(-2)}`;
}

/** Helper: "Jan 26 YTD as % of FY26 Budget" */
export function getBudgetPercentLabel(config?: DashboardConfig): string {
  const c = config ?? getDashboardConfig();
  return `${c.currentMonthShort} ${String(c.ytdYears[2]).slice(-2)} YTD as % of FY${String(c.ytdYears[2]).slice(-2)} Budget`;
}

/** Month options for the admin panel */
export const MONTH_OPTIONS = [
  { full: "July", short: "Jul" },
  { full: "August", short: "Aug" },
  { full: "September", short: "Sep" },
  { full: "October", short: "Oct" },
  { full: "November", short: "Nov" },
  { full: "December", short: "Dec" },
  { full: "January", short: "Jan" },
  { full: "February", short: "Feb" },
  { full: "March", short: "Mar" },
  { full: "April", short: "Apr" },
  { full: "May", short: "May" },
  { full: "June", short: "Jun" },
];

/** Get months elapsed given a month name (fiscal year starts July) */
export function getMonthsElapsed(monthFull: string): number {
  const fiscalOrder = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
  const idx = fiscalOrder.indexOf(monthFull);
  return idx >= 0 ? idx + 1 : 7;
}
