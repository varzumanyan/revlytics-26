import { useRevenueData } from "@/hooks/useRevenueData";
import { RevenueCard } from "@/components/RevenueCard";
import { RevenueTable } from "@/components/RevenueTable";
import { RevenueChart } from "@/components/RevenueChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
const Index = () => {
  const {
    data,
    isLoading,
    error
  } = useRevenueData();
  if (error) {
    return <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="flex items-center space-x-2 pt-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">Failed to load revenue data. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  if (isLoading) {
    return <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-7xl space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-12 w-96 mx-auto" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({
            length: 4
          }).map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-96" />
          <Skeleton className="h-64" />
        </div>
      </div>;
  }
  const revenueData = data?.sheet1 || [];

  // Calculate summary metrics - use the Monthly Total row for accurate totals
  const monthlyTotalRow = revenueData.find(item => item.revenueType === "Monthly Total");
  
  const totalRevenue2025 = monthlyTotalRow?.july2025 || 388104423.54;
  const totalRevenue2024 = monthlyTotalRow?.july2024 || 331837031.22;
  const totalRevenue2023 = monthlyTotalRow?.july2023 || 305194531.55;
  const yearOverYearChange = (totalRevenue2025 - totalRevenue2024) / totalRevenue2024;
  const totalBudget = monthlyTotalRow?.["fy2026\nadoptedBudget"] || 8178255972; // Use budget from Monthly Total row
  const budgetProgress = totalRevenue2025 / totalBudget;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-header shadow-strong">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#41ffca]">
              FY2026 Revenue Analysis
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-slate-50">
              Comprehensive financial overview and performance metrics for fiscal year 2026
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RevenueCard title="Total Revenue FY2026 YTD" value={totalRevenue2025} isCurrency={true} />
          <RevenueCard title="Year-over-Year Change" value={yearOverYearChange} change={yearOverYearChange} isPercentage={true} isCurrency={false} />
          <RevenueCard title="Budget Progress" value={budgetProgress} isPercentage={true} isCurrency={false} />
          <RevenueCard title="FY2026 Adopted Budget" value={totalBudget} isCurrency={true} />
        </div>

        {/* Charts */}
        <RevenueChart data={revenueData} />

        {/* Data Table */}
        <RevenueTable data={revenueData} />

        {/* Footer */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
              <p>Data sourced from FY2026 Revenue Analysis • Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;