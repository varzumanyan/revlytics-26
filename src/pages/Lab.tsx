import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Beaker, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useExpenditureData } from "@/hooks/useExpenditureData";
import { useRevenueData } from "@/hooks/useRevenueData";
import { getDashboardConfig } from "@/utils/dashboardConfig";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  RadialBarChart, RadialBar, Legend,
  Treemap,
} from "recharts";

const COLORS = [
  "hsl(171, 100%, 63%)", "hsl(45, 100%, 63%)", "hsl(220, 70%, 50%)",
  "hsl(0, 84%, 60%)", "hsl(142, 76%, 36%)", "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 60%)", "hsl(190, 80%, 50%)", "hsl(340, 75%, 55%)",
  "hsl(160, 60%, 45%)", "hsl(25, 95%, 55%)", "hsl(260, 60%, 55%)",
];

const formatCurrency = (value: number) => {
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (Math.abs(value) >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
};

// --- Animated Radial Gauge ---
const BudgetRadialGauge = ({ name, spent, budget, color }: { name: string; spent: number; budget: number; color: string }) => {
  const pct = budget > 0 ? (spent / budget) * 100 : 0;
  const data = [{ name, value: Math.min(pct, 100), fill: color }];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width={140} height={140}>
        <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" startAngle={180} endAngle={-180} data={data}>
          <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "hsl(240, 3.7%, 15.9%)" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <p className="text-xs text-muted-foreground text-center mt-1 max-w-[120px] truncate">{name}</p>
      <p className={`text-sm font-bold ${pct > 58.3 ? "text-destructive" : "text-success"}`}>
        {pct.toFixed(1)}%
      </p>
      <p className="text-[10px] text-muted-foreground">{formatCurrency(spent)} / {formatCurrency(budget)}</p>
    </div>
  );
};

// --- Interactive Treemap ---
const CustomTreemapContent = ({ x, y, width, height, name, value, index }: any) => {
  if (width < 30 || height < 30) return null;
  const color = COLORS[index % COLORS.length];
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.85} stroke="hsl(240, 10%, 3.9%)" strokeWidth={2} rx={4} className="transition-all duration-200 hover:fill-opacity-100 cursor-pointer" />
      {width > 60 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle" fill="white" fontSize={width > 100 ? 11 : 9} fontWeight="600">
            {name?.length > (width / 7) ? name.slice(0, Math.floor(width / 7)) + "…" : name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="white" fontSize={10} opacity={0.8}>
            {formatCurrency(value)}
          </text>
        </>
      )}
    </g>
  );
};

// --- Waterfall-style Budget Comparison ---
const BudgetWaterfallBar = ({ items }: { items: { name: string; spent: number; budget: number }[] }) => {
  const data = items.map(item => ({
    name: item.name.length > 12 ? item.name.slice(0, 12) + "…" : item.name,
    fullName: item.name,
    spent: item.spent,
    budget: item.budget,
    remaining: Math.max(0, item.budget - item.spent),
    over: Math.max(0, item.spent - item.budget),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 3.7%, 20%)" horizontal={false} />
        <XAxis type="number" tickFormatter={formatCurrency} tick={{ fill: "hsl(240, 5%, 64.9%)", fontSize: 11 }} />
        <YAxis type="category" dataKey="name" width={100} tick={{ fill: "hsl(240, 5%, 64.9%)", fontSize: 11 }} />
        <Tooltip
          contentStyle={{ background: "hsl(240, 10%, 8%)", border: "1px solid hsl(240, 3.7%, 20%)", borderRadius: 8, color: "white" }}
          formatter={(value: number, name: string) => [formatCurrency(value), name === "spent" ? "Spent YTD" : name === "remaining" ? "Remaining" : "Over Budget"]}
          labelFormatter={(label: string, payload: any[]) => payload?.[0]?.payload?.fullName || label}
        />
        <Bar dataKey="spent" stackId="a" fill="hsl(171, 100%, 63%)" radius={[0, 0, 0, 0]} />
        <Bar dataKey="remaining" stackId="a" fill="hsl(240, 3.7%, 25%)" radius={[0, 4, 4, 0]} />
        <Bar dataKey="over" fill="hsl(0, 84%, 60%)" radius={[0, 4, 4, 0]} />
        <Legend
          formatter={(value) => value === "spent" ? "Spent YTD" : value === "remaining" ? "Remaining Budget" : "Over Budget"}
          wrapperStyle={{ color: "hsl(240, 5%, 64.9%)", fontSize: 12 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// --- Main Lab Page ---
const Lab = () => {
  const navigate = useNavigate();
  const config = getDashboardConfig();
  const { data: expData, isLoading: expLoading } = useExpenditureData();
  const { data: revData, isLoading: revLoading } = useRevenueData();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const expenditures = useMemo(() => {
    if (!expData?.expenses) return [];
    return expData.expenses
      .filter(e => e.generalFundDepartment && e.generalFundDepartment !== "TOTAL" && e.generalFundDepartment !== "Total")
      .map(e => {
        // Dynamically find YTD field
        const keys = Object.keys(e);
        const ytdKey = keys.find(k => /^\w+2026Ytd$/.test(k)) || keys.find(k => /^\w+2025Ytd$/.test(k)) || '';
        return {
          name: e.generalFundDepartment,
          spent: typeof e[ytdKey] === "number" ? e[ytdKey] : 0,
          budget: typeof e.fy26AdoptedBudget === "number" ? e.fy26AdoptedBudget : 0,
          pctUsed: typeof e["%OfFy26Budget"] === "number" ? (e["%OfFy26Budget"] as number) * 100 : 0,
        };
      })
      .filter(e => e.budget > 0)
      .sort((a, b) => b.budget - a.budget);
  }, [expData]);

  const revenues = useMemo(() => {
    if (!revData?.revenue) return [];
    return revData.revenue
      .filter(r => r.revenueType && r.revenueType !== "TOTAL" && r.revenueType !== "Total" && r.revenueType !== "Totals:")
      .map(r => {
        const keys = Object.keys(r);
        // Find the latest YTD value dynamically
        const ytdKey = keys.find(k => k.toLowerCase().includes("2025") || k.toLowerCase().includes("2026"));
        const budgetKey = keys.find(k => k.toLowerCase().includes("adoptedbudget") || k.toLowerCase().includes("adopted"));
        return {
          name: r.revenueType,
          collected: ytdKey ? (typeof r[ytdKey] === "number" ? r[ytdKey] as number : 0) : 0,
          budget: budgetKey ? (typeof r[budgetKey] === "number" ? r[budgetKey] as number : 0) : 0,
        };
      })
      .filter(r => r.budget > 0 || r.collected > 0)
      .sort((a, b) => b.collected - a.collected);
  }, [revData]);

  const treemapData = useMemo(() =>
    expenditures.slice(0, 20).map(e => ({ name: e.name, size: e.spent })),
    [expenditures]
  );

  const totalSpent = expenditures.reduce((sum, e) => sum + e.spent, 0);
  const totalBudget = expenditures.reduce((sum, e) => sum + e.budget, 0);
  const totalRevCollected = revenues.reduce((sum, r) => sum + r.collected, 0);
  const totalRevBudget = revenues.reduce((sum, r) => sum + r.budget, 0);

  const isLoading = expLoading || revLoading;

  const pieData = useMemo(() =>
    expenditures.slice(0, 8).map((e, i) => ({ name: e.name, value: e.spent, fill: COLORS[i % COLORS.length] })),
    [expenditures]
  );

  const selectedDetail = selectedDept ? expenditures.find(e => e.name === selectedDept) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Beaker className="h-5 w-5 text-chart-primary" />
            <h1 className="text-xl font-bold text-foreground">Visual Lab</h1>
          </div>
          <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">Experimental</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            {/* Hero Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-card border-border shadow-soft overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Expenditure YTD</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(totalSpent)}</p>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-chart-primary to-primary transition-all duration-1000"
                      style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {((totalSpent / totalBudget) * 100).toFixed(1)}% of {formatCurrency(totalBudget)} budget
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border shadow-soft overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent" />
                <CardContent className="p-6 relative">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Revenue YTD</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(totalRevCollected)}</p>
                  <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-success to-chart-primary transition-all duration-1000"
                      style={{ width: `${Math.min((totalRevCollected / totalRevBudget) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {((totalRevCollected / totalRevBudget) * 100).toFixed(1)}% of {formatCurrency(totalRevBudget)} budget
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Radial Gauges - Top Departments */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">🎯 Budget Utilization Gauges — Top Departments</CardTitle>
                <p className="text-xs text-muted-foreground">Each gauge shows % of budget spent. Red = over threshold.</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6 justify-center">
                  {expenditures.slice(0, 10).map((e, i) => (
                    <div key={e.name} className="cursor-pointer hover:scale-105 transition-transform" onClick={() => setSelectedDept(e.name === selectedDept ? null : e.name)}>
                      <BudgetRadialGauge name={e.name} spent={e.spent} budget={e.budget} color={COLORS[i % COLORS.length]} />
                    </div>
                  ))}
                </div>
                {selectedDetail && (
                  <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border animate-fade-in">
                    <h3 className="font-semibold text-foreground">{selectedDetail.name}</h3>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Spent YTD</p>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(selectedDetail.spent)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-lg font-bold text-foreground">{formatCurrency(selectedDetail.budget)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Remaining</p>
                        <p className={`text-lg font-bold ${selectedDetail.budget - selectedDetail.spent < 0 ? "text-destructive" : "text-success"}`}>
                          {formatCurrency(selectedDetail.budget - selectedDetail.spent)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expenditure Treemap */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">🗺️ Spending Treemap</CardTitle>
                <p className="text-xs text-muted-foreground">Block size = amount spent. Hover to see details.</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <Treemap
                    data={treemapData}
                    dataKey="size"
                    aspectRatio={4 / 3}
                    content={<CustomTreemapContent />}
                  >
                    <Tooltip
                      contentStyle={{ background: "hsl(240, 10%, 8%)", border: "1px solid hsl(240, 3.7%, 20%)", borderRadius: 8, color: "white" }}
                      formatter={(value: number) => [formatCurrency(value), "Spent YTD"]}
                    />
                  </Treemap>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Budget vs Spent Waterfall */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">📊 Budget vs Spent — Top 15 Departments</CardTitle>
                <p className="text-xs text-muted-foreground">Stacked bars show spent (teal) + remaining (dark). Red = over budget.</p>
              </CardHeader>
              <CardContent>
                <BudgetWaterfallBar items={expenditures.slice(0, 15)} />
              </CardContent>
            </Card>

            {/* Interactive Pie with Click */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">🍩 Expenditure Share — Click to Explore</CardTitle>
                <p className="text-xs text-muted-foreground">Click a slice to see department details.</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={110}
                        paddingAngle={2}
                        dataKey="value"
                        onClick={(data) => setSelectedDept(data.name === selectedDept ? null : data.name)}
                        className="cursor-pointer"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={entry.fill}
                            stroke={entry.name === selectedDept ? "white" : "transparent"}
                            strokeWidth={entry.name === selectedDept ? 3 : 0}
                            fillOpacity={selectedDept && entry.name !== selectedDept ? 0.4 : 1}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: "hsl(240, 10%, 8%)", border: "1px solid hsl(240, 3.7%, 20%)", borderRadius: 8, color: "white" }}
                        formatter={(value: number) => [formatCurrency(value), "Spent"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2">
                    {pieData.map((entry, i) => {
                      const dept = expenditures.find(e => e.name === entry.name);
                      return (
                        <div
                          key={entry.name}
                          className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all ${
                            entry.name === selectedDept ? "bg-muted/50 ring-1 ring-border" : "hover:bg-muted/20"
                          }`}
                          onClick={() => setSelectedDept(entry.name === selectedDept ? null : entry.name)}
                        >
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ background: entry.fill }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">{entry.name}</p>
                            <p className="text-[10px] text-muted-foreground">{formatCurrency(entry.value)}</p>
                          </div>
                          {dept && (
                            <span className={`text-[10px] font-semibold ${dept.pctUsed > 58.3 ? "text-destructive" : "text-success"}`}>
                              {dept.pctUsed.toFixed(0)}%
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue vs Budget Bars */}
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">💰 Revenue Collection vs Budget</CardTitle>
                <p className="text-xs text-muted-foreground">How much of each revenue source has been collected so far.</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {revenues.slice(0, 12).map((r, i) => {
                    const pct = r.budget > 0 ? (r.collected / r.budget) * 100 : 0;
                    return (
                      <div key={r.name} className="group">
                        <div className="flex justify-between items-baseline mb-1">
                          <p className="text-xs text-foreground font-medium truncate max-w-[60%]">{r.name}</p>
                          <div className="flex gap-3 text-[10px] text-muted-foreground">
                            <span>{formatCurrency(r.collected)}</span>
                            <span className={`font-semibold ${pct > (config.percentageThreshold * 100) ? "text-success" : "text-destructive"}`}>
                              {pct.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                          <div
                            className="absolute h-full rounded-full transition-all duration-700 group-hover:brightness-125"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              background: `${COLORS[i % COLORS.length]}`,
                            }}
                          />
                          {/* Threshold marker */}
                          <div
                            className="absolute top-0 h-full w-0.5 bg-warning"
                            style={{ left: `${config.percentageThreshold * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Yellow line = {(config.percentageThreshold * 100).toFixed(1)}% expected threshold ({config.monthsElapsed}/12 months)
                  </p>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Lab;
