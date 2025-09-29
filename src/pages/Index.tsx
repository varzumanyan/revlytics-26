import { useRevenueData } from "@/hooks/useRevenueData";
import { useExpenditureData } from "@/hooks/useExpenditureData";
import { RevenueCard } from "@/components/RevenueCard";
import { RevenueTable } from "@/components/RevenueTable";
import { RevenueChart } from "@/components/RevenueChart";
import { ExpenditureCard } from "@/components/ExpenditureCard";
import { ExpenditureTable } from "@/components/ExpenditureTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, TrendingUp, DollarSign, BarChart3 } from "lucide-react";
const Index = () => {
  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError
  } = useRevenueData();
  const {
    data: expenditureData,
    isLoading: expenditureLoading,
    error: expenditureError
  } = useExpenditureData();
  if (revenueError || expenditureError) {
    return <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="flex items-center space-x-2 pt-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">Failed to load data. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>;
  }
  if (revenueLoading || expenditureLoading) {
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
  if (!revenueData || !expenditureData) {
    return <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-destructive/10 border-destructive/50">
            <CardContent className="flex items-center space-x-2 pt-6">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-destructive">Data not available. Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </div>;
  }

  const revenueDataSheet = revenueData?.sheet1 || [];
  const expenditureDataSheet = expenditureData?.summary || [];

  // Calculate summary metrics - use the Monthly Total row for accurate totals
  const monthlyTotalRow = revenueDataSheet.find(item => item.revenueType === "Monthly Total");
  
  const totalRevenue2025 = monthlyTotalRow?.august2025 || 388104423.54;
  const totalRevenue2024 = monthlyTotalRow?.august2024 || 331837031.22;
  const totalRevenue2023 = monthlyTotalRow?.august2023 || 305194531.55;
  const yearOverYearChange = (totalRevenue2025 - totalRevenue2024) / totalRevenue2024;
  const totalBudget = monthlyTotalRow?.["fy2026\nadoptedBudget"] || 8178255972; // Use budget from Monthly Total row
  const budgetProgress = totalRevenue2025 / totalBudget;

  // Calculate expenditure metrics for FY2026 only - filter to main categories only to avoid double counting
  const mainCategories = expenditureDataSheet.filter(item => item.category && item.category.trim() !== '');
  const totalExpenditureBudget = mainCategories.length > 0 ? 
    mainCategories.reduce((sum, item) => sum + (item.adoptBudget || 0), 0) : 0;
  const totalExpenditures = mainCategories.length > 0 ? 
    mainCategories.reduce((sum, item) => sum + (item.expenditures || 0), 0) : 0;
  const expenditureBudgetUtilization = totalExpenditureBudget > 0 ? totalExpenditures / totalExpenditureBudget : 0;
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-header shadow-strong">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#41ffca]">
              FY2026 Financial Analysis
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-slate-50">
              Comprehensive revenue and expenditure overview for fiscal year 2026
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-8">
            {/* Revenue Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RevenueCard title="Total Revenue FY2026 YTD" value={totalRevenue2025} isCurrency={true} />
              <RevenueCard title="Year-over-Year Change" value={yearOverYearChange} change={yearOverYearChange} isPercentage={true} isCurrency={false} />
              <RevenueCard title="FY2026 YTD Budget Progress" value={budgetProgress} isPercentage={true} isCurrency={false} />
              <RevenueCard title="FY2026 Adopted Budget" value={totalBudget} isCurrency={true} />
            </div>

            {/* Charts */}
            <RevenueChart data={revenueDataSheet} />

            {/* Revenue Data Table */}
            <RevenueTable data={revenueDataSheet} />
          </TabsContent>

          <TabsContent value="expenditures" className="space-y-8">
            {/* Expenditure Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ExpenditureCard
                title="Total Budget"
                value={totalExpenditureBudget}
                isCurrency={true}
                description="FY2026 adopted budget"
              />
              <ExpenditureCard
                title="YTD Expenditures"
                value={totalExpenditures}
                isCurrency={true}
                description="Year-to-date spending"
              />
              <ExpenditureCard
                title="Budget Utilization"
                value={expenditureBudgetUtilization}
                isPercentage={true}
                change="of total budget"
                changeType={expenditureBudgetUtilization > 0.5 ? 'negative' : expenditureBudgetUtilization < 0.2 ? 'positive' : 'neutral'}
                description="Percentage of budget used"
              />
              <ExpenditureCard
                title="Remaining Budget"
                value={totalExpenditureBudget - totalExpenditures}
                isCurrency={true}
                description="Available for remainder of FY"
              />
            </div>

            {/* Expenditure Data Table */}
            <ExpenditureTable data={expenditureDataSheet} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardContent className="text-center py-8">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <BarChart3 className="h-5 w-5" />
              <p>Data sourced from FY2026 Financial Analysis • Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default Index;