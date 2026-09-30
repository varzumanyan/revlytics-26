import { useMemo, useState } from "react";
import revenueCsv from "@/data/fy27/revenue.csv?raw";
import expensesCsv from "@/data/fy27/expenses.csv?raw";
import deptCsv from "@/data/fy27/departmentalReceipts.csv?raw";
import uutCsv from "@/data/fy27/utilityUsersTax.csv?raw";
import totCsv from "@/data/fy27/transientOccupancyTax.csv?raw";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RevenueCard } from "@/components/RevenueCard";
import { ExpenditureCard } from "@/components/ExpenditureCard";
import { BudgetProgressGauge } from "@/components/BudgetProgressGauge";

// FY2027 data comes from the attached sheets (through August 2026 = 2 of 12 months)
const MONTHS_ELAPSED = 2;
const THRESHOLD = MONTHS_ELAPSED / 12;
const PERIOD = "July - Aug 2026";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const num = (s?: string) => {
  if (!s) return 0;
  const t = s.trim();
  const neg = t.includes("(") || t.startsWith("-");
  const n = parseFloat(t.replace(/[^0-9.]/g, ""));
  return isNaN(n) ? 0 : neg ? -n : n;
};
const pct = (s?: string) => num(s) / 100;

const usd = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
const fmtPct = (v: number) => `${(v * 100).toFixed(2)}%`;

interface RevRow { type: string; y1: number; y2: number; y3: number; chg: number; chgPct: number; budgetPct: number; budget: number; }
interface ExpRow { dept: string; ytd25: number; bud25: number; pct25: number; ytd26: number; bud26: number; pct26: number; ytd27: number; bud27: number; pct27: number; }
interface DetailRow { category: string; sub: string; y1: number; y2: number; y3: number; chg: number; chgPct: number; }

const revenue: RevRow[] = parseCsv(revenueCsv).slice(1)
  .filter(r => r[0]?.trim())
  .map(r => ({ type: r[0].trim(), y1: num(r[1]), y2: num(r[2]), y3: num(r[3]), chg: num(r[7]), chgPct: pct(r[8]), budgetPct: pct(r[10]), budget: num(r[11]) }));

const expenses: ExpRow[] = parseCsv(expensesCsv).slice(1)
  .filter(r => r[0]?.trim())
  .map(r => ({ dept: r[0].trim(), ytd25: num(r[1]), bud25: num(r[2]), pct25: pct(r[3]), ytd26: num(r[4]), bud26: num(r[5]), pct26: pct(r[6]), ytd27: num(r[7]), bud27: num(r[8]), pct27: pct(r[9]) }));

const details = (csv: string): DetailRow[] => parseCsv(csv).slice(1)
  .filter(r => r[2]?.trim())
  .map(r => ({ category: r[1].trim(), sub: r[2].trim(), y1: num(r[3]), y2: num(r[4]), y3: num(r[5]), chg: num(r[6]), chgPct: pct(r[7]) }));

const BREAKDOWNS: Record<string, DetailRow[]> = {
  "Departmental Receipts": details(deptCsv),
  "Utility Users' Tax": details(uutCsv),
  "Transient Occupancy Tax": details(totCsv),
};

const th = "px-2 py-2 text-left align-bottom font-semibold whitespace-normal text-xs text-muted-foreground";
const td = "px-2 py-1.5 text-right tabular-nums text-sm";
const chgCls = (v: number, invert = false) => (v === 0 ? "" : (v > 0) !== invert ? "text-green-500" : "text-red-500");

export const FY2027Dashboard = () => {
  const [open, setOpen] = useState<string | null>(null);
  const total = revenue.find(r => r.type === "Revenue to Date");
  const totalExp = expenses.find(e => e.dept.toLowerCase() === "total expenses");
  const revYoy = total && total.y2 ? (total.y3 - total.y2) / total.y2 : 0;
  const expYoy = totalExp && totalExp.ytd26 ? (totalExp.ytd27 - totalExp.ytd26) / totalExp.ytd26 : 0;
  const breakdown = open ? BREAKDOWNS[open] : [];
  const revRows = useMemo(() => revenue.filter(r => r.type !== "Revenue to Date"), []);

  return (
    <div className="space-y-6">
      <p className="text-center text-sm text-muted-foreground italic">
        FY2027 data through August 2026 (2 of 12 months, {fmtPct(THRESHOLD)} of the year elapsed).
      </p>
      <Tabs defaultValue="rev">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rev">FY27 Revenue</TabsTrigger>
          <TabsTrigger value="exp">FY27 Expenditures</TabsTrigger>
        </TabsList>

        <TabsContent value="rev" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RevenueCard title="Total Revenue FY2027 YTD" value={total?.y3 ?? 0} description={PERIOD} />
            <RevenueCard title="Year-over-Year Change" value={revYoy} change={revYoy} isPercentage isCurrency={false} />
            <BudgetProgressGauge title="FY2027 YTD Budget Progress" subtitle={PERIOD} actualProgress={total?.budgetPct ?? 0} monthsElapsed={MONTHS_ELAPSED} totalMonths={12} />
            <RevenueCard title="FY2027 Adopted Budget" value={total?.budget ?? 0} />
          </div>
          <Card>
            <CardHeader><CardTitle>FY2027 YTD GF Revenue Analysis</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className={`${th} w-48`}>Revenue Type</th>
                    <th className={th}>Aug 24 YTD</th><th className={th}>Aug 25 YTD</th><th className={th}>Aug 26 YTD</th>
                    <th className={th}>Aug26 vs Aug25</th><th className={th}>YoY %</th>
                    <th className={th}>Aug 26 YTD as % of FY27 Budget</th><th className={th}>FY2027 Adopted Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {[...revRows, ...(total ? [total] : [])].map(r => {
                    const clickable = !!BREAKDOWNS[r.type];
                    const isTotal = r.type === "Revenue to Date";
                    return (
                      <tr key={r.type} className={`border-b border-border/50 ${isTotal ? "font-bold bg-muted/40" : ""}`}>
                        <td className="px-2 py-1.5 text-sm">
                          {clickable ? <button className="text-primary underline text-left" onClick={() => setOpen(r.type)}>{r.type}</button> : r.type}
                        </td>
                        <td className={td}>{usd(r.y1)}</td><td className={td}>{usd(r.y2)}</td><td className={td}>{usd(r.y3)}</td>
                        <td className={`${td} ${chgCls(r.chg)}`}>{usd(r.chg)}</td>
                        <td className={`${td} ${chgCls(r.chgPct)}`}>{fmtPct(r.chgPct)}</td>
                        <td className={`${td} ${r.budget ? (r.budgetPct >= THRESHOLD ? "text-green-500" : "text-red-500") : ""}`}>{fmtPct(r.budgetPct)}</td>
                        <td className={td}>{usd(r.budget)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exp" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ExpenditureCard title="Total Expenditure FY2027 YTD" value={totalExp?.ytd27 ?? 0} isCurrency description={PERIOD} />
            <ExpenditureCard title="Year-over-Year Change" value={expYoy} isPercentage change={`${expYoy >= 0 ? "↑" : "↓"} ${(Math.abs(expYoy) * 100).toFixed(2)}%`} changeType={expYoy > 0 ? "negative" : "positive"} />
            <BudgetProgressGauge title="FY2027 YTD Budget Progress" subtitle={PERIOD} actualProgress={totalExp?.pct27 ?? 0} monthsElapsed={MONTHS_ELAPSED} totalMonths={12} isExpenditure />
            <ExpenditureCard title="FY2027 Adopted Budget" value={totalExp?.bud27 ?? 0} isCurrency description="Full year budget" />
          </div>
          <Card>
            <CardHeader><CardTitle>FY2027 YTD GF Expenditure Analysis</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead className="border-b border-border">
                  <tr>
                    <th className={`${th} w-44`}>General Fund Department</th>
                    <th className={th}>FY25 Aug 2024 YTD</th><th className={th}>FY25 Adopted Budget</th><th className={th}>% of FY25 Budget</th>
                    <th className={th}>FY26 Aug 2025 YTD</th><th className={th}>FY26 Adopted Budget</th><th className={th}>% of FY26 Budget</th>
                    <th className={th}>FY27 Aug 2026 YTD</th><th className={th}>FY27 Adopted Budget</th><th className={th}>% of FY27 Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => {
                    const isTotal = e.dept.toLowerCase().startsWith("total");
                    return (
                      <tr key={e.dept} className={`border-b border-border/50 ${isTotal ? "font-bold bg-muted/40" : ""}`}>
                        <td className="px-2 py-1.5 text-sm">{e.dept}</td>
                        <td className={td}>{usd(e.ytd25)}</td><td className={td}>{usd(e.bud25)}</td><td className={td}>{fmtPct(e.pct25)}</td>
                        <td className={td}>{usd(e.ytd26)}</td><td className={td}>{usd(e.bud26)}</td><td className={td}>{fmtPct(e.pct26)}</td>
                        <td className={td}>{usd(e.ytd27)}</td><td className={td}>{usd(e.bud27)}</td>
                        <td className={`${td} ${e.bud27 ? (e.pct27 > THRESHOLD ? "text-red-500" : "text-green-500") : ""}`}>{fmtPct(e.pct27)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!open} onOpenChange={o => !o && setOpen(null)}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-auto">
          <DialogHeader><DialogTitle>{open} — FY2027 Breakdown</DialogTitle></DialogHeader>
          <table className="w-full min-w-[700px] border-collapse">
            <thead className="sticky top-0 bg-background border-b border-border">
              <tr>
                <th className={`${th} w-40`}>Category</th><th className={`${th} w-56`}>Sub Category</th>
                <th className={th}>Aug 24 YTD</th><th className={th}>Aug 25 YTD</th><th className={th}>Aug 26 YTD</th>
                <th className={th}>Aug26 vs Aug25</th><th className={th}>YoY %</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((d, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="px-2 py-1.5 text-sm">{d.category}</td><td className="px-2 py-1.5 text-sm">{d.sub}</td>
                  <td className={td}>{usd(d.y1)}</td><td className={td}>{usd(d.y2)}</td><td className={td}>{usd(d.y3)}</td>
                  <td className={`${td} ${chgCls(d.chg)}`}>{usd(d.chg)}</td>
                  <td className={`${td} ${chgCls(d.chgPct)}`}>{fmtPct(d.chgPct)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
      </Dialog>
    </div>
  );
};
