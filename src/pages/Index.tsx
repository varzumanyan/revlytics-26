import { useRevenueData } from "@/hooks/useRevenueData";
import { useExpenditureData } from "@/hooks/useExpenditureData";
import { Navbar } from "@/components/Navbar";
import { RevenueCard } from "@/components/RevenueCard";
import { BudgetProgressGauge } from "@/components/BudgetProgressGauge";
import { RevenueTable } from "@/components/RevenueTable";
import { RevenueChart } from "@/components/RevenueChart";
import { ExpenditureCard } from "@/components/ExpenditureCard";
import { ExpenditureTable } from "@/components/ExpenditureTable";
import { ExpenditureChartsGrid } from "@/components/ExpenditureChartsGrid";
import { ExpenditureChart } from "@/components/ExpenditureChart";
import { ExpenditurePieChart } from "@/components/ExpenditurePieChart";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
import { getDashboardConfig, getFiscalPeriodLabel } from "@/utils/dashboardConfig";
import { getExpenditureYtdFields } from "@/types/expenditure";
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
    return <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="container mx-auto max-w-2xl">
          <Card className="border-[#41ffca]/30 bg-gradient-card shadow-strong">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="rounded-full bg-[#41ffca]/10 p-4">
                  <AlertCircle className="h-10 w-10 text-[#41ffca]" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-[#41ffca]">
                Maintenance in Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center pb-8">
              <p className="text-slate-50 text-lg">
                We are currently performing updates on the FY2026 General Fund Revenue &amp; Expense dashboard.
              </p>
              <p className="text-slate-300">
                Data from our source provider is temporarily unavailable. Please check back soon — the dashboard will be restored as soon as the maintenance is complete.
              </p>
              <p className="text-sm text-slate-400 italic">
                Thank you for your patience.
              </p>
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

  const revenueDataSheet = revenueData?.revenue || [];
  const expenditureDataSheet = expenditureData?.expenses || [];

  // console.log('Revenue data sheet:', revenueDataSheet);
  // console.log('Number of revenue items:', revenueDataSheet.length);

  // Calculate summary metrics - use the Revenue to Date row for accurate totals
  const monthlyTotalRow = revenueDataSheet.find(item => item.revenueType === "Revenue to Date");
  // console.log('Revenue to Date Row:', monthlyTotalRow);
  
  // Get dynamic field references for calculations
  const dateFields = ApiFieldMapper.getDateFields(revenueDataSheet);
  // console.log('Date fields detected:', dateFields);
  
  const totalRevenue2025 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year3] || 0 : 0;
  const totalRevenue2024 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year2] || 0 : 0;
  const totalRevenue2023 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year1] || 0 : 0;
  // console.log('Total revenue values:', { totalRevenue2023, totalRevenue2024, totalRevenue2025 });
  
  const yearOverYearChange = totalRevenue2024 > 0 ? (totalRevenue2025 - totalRevenue2024) / totalRevenue2024 : 0;
  const totalBudget = monthlyTotalRow?.["fy2026\nadoptedBudget"] || 0;
  const budgetProgress = totalBudget > 0 ? totalRevenue2025 / totalBudget : 0;

  // Calculate expenditure metrics dynamically
  const expYtdFields = getExpenditureYtdFields(expenditureDataSheet);
  const totalExpensesRow = expenditureDataSheet.find(item => 
    item.generalFundDepartment?.toLowerCase() === 'total expenses'
  );
  
  const totalExpenditureBudget = totalExpensesRow?.fy26AdoptedBudget || 0;
  const totalExpenditures = expYtdFields ? Number(totalExpensesRow?.[expYtdFields.year3] || 0) : 0;
  const totalExpenditures2024 = expYtdFields ? Number(totalExpensesRow?.[expYtdFields.year2] || 0) : 0;
  const expenditureYearOverYearChange = totalExpenditures2024 > 0 
    ? (totalExpenditures - totalExpenditures2024) / totalExpenditures2024 
    : 0;
  const expenditureBudgetUtilization = totalExpenditureBudget > 0 ? totalExpenditures / totalExpenditureBudget : 0;
  
  // console.log('Expenditure YTD fields:', expYtdFields);
  // console.log('Total Expenses Row:', totalExpensesRow);
  // console.log('Expenditure metrics:', { totalExpenditureBudget, totalExpenditures, totalExpenditures2024, expenditureYearOverYearChange, expenditureBudgetUtilization });
  const dashConfig = getDashboardConfig();
  const periodLabel = getFiscalPeriodLabel(dashConfig);

  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <header className="bg-gradient-header shadow-strong">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#41ffca]/40 bg-[#41ffca]/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#41ffca]">
                <span className="h-2 w-2 rounded-full bg-[#41ffca] animate-pulse" aria-hidden="true" />
                Preliminary
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#41ffca]">
              FY2026 General Fund Revenue &amp; Expense Analysis
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-slate-50">
              City of Los Angeles General Fund Revenue and Expenditure Overview for Fiscal Year 2026
            </p>
            <p className="text-sm max-w-2xl mx-auto text-slate-300 italic">
              FY26 revenue and expenses are preliminary and will not be final until the year is closed in August.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50" aria-label="Financial data categories">
            <TabsTrigger 
              value="revenue" 
              className="text-lg font-semibold data-[state=active]:bg-[#41ffca] data-[state=active]:text-black data-[state=active]:shadow-md"
            >
              Revenue
            </TabsTrigger>
            <TabsTrigger 
              value="expenditures"
              className="text-lg font-semibold data-[state=active]:bg-[#41ffca] data-[state=active]:text-black data-[state=active]:shadow-md"
            >
              Expenditures
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-8">
            {/* Revenue Key Metrics */}
            <section aria-labelledby="revenue-metrics-heading">
              <h2 id="revenue-metrics-heading" className="sr-only">Revenue Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RevenueCard 
                title="Total Revenue FY2026 YTD" 
                value={totalRevenue2025} 
                isCurrency={true}
                description={periodLabel}
              />
              <RevenueCard 
                title="Year-over-Year Change" 
                value={yearOverYearChange} 
                change={yearOverYearChange} 
                isPercentage={true} 
                isCurrency={false} 
              />
              <BudgetProgressGauge 
                title="FY2026 YTD Budget Progress" 
                subtitle={periodLabel}
                actualProgress={budgetProgress}
                monthsElapsed={dashConfig.monthsElapsed}
                totalMonths={12}
              />
              <RevenueCard 
                title="FY2026 Adopted Budget" 
                value={totalBudget} 
                isCurrency={true} 
              />
            </div>
            </section>

            {/* Charts */}
            <section aria-labelledby="revenue-chart-heading">
              <h2 id="revenue-chart-heading" className="sr-only">Revenue Visualization</h2>
            <RevenueChart data={revenueDataSheet} />
            </section>

            {/* Revenue Data Table */}
            <section aria-labelledby="revenue-table-heading">
              <h2 id="revenue-table-heading" className="sr-only">Revenue Data Table</h2>
            <RevenueTable data={revenueDataSheet} />
            </section>
          </TabsContent>

          <TabsContent value="expenditures" className="space-y-8">
            {/* Expenditure Key Metrics */}
            <section aria-labelledby="expenditure-metrics-heading">
              <h2 id="expenditure-metrics-heading" className="sr-only">Expenditure Key Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ExpenditureCard
                title="Total Expenditure FY2026 YTD"
                value={totalExpenditures}
                isCurrency={true}
                description={periodLabel}
              />
              <ExpenditureCard
                title="Year-over-Year Change"
                value={expenditureYearOverYearChange}
                isPercentage={true}
                change={`↑ ${(expenditureYearOverYearChange * 100).toFixed(2)}%`}
                changeType={expenditureYearOverYearChange > 0 ? 'negative' : 'positive'}
              />
              <BudgetProgressGauge
                title="FY2026 YTD Budget Progress"
                subtitle={periodLabel}
                actualProgress={expenditureBudgetUtilization}
                monthsElapsed={dashConfig.monthsElapsed}
                totalMonths={12}
                isExpenditure={true}
              />
              <ExpenditureCard
                title="FY2026 Adopted Budget"
                value={totalExpenditureBudget}
                isCurrency={true}
                description="Full year budget"
              />
            </div>
            </section>

            {/* Expenditure Charts */}
            <section aria-labelledby="expenditure-charts-heading">
              <h2 id="expenditure-charts-heading" className="sr-only">Expenditure Visualizations</h2>
            <ExpenditureChartsGrid data={expenditureDataSheet} />
            </section>

            {/* Expenditure Data Table */}
            <section aria-labelledby="expenditure-table-heading">
              <h2 id="expenditure-table-heading" className="sr-only">Expenditure Data Table</h2>
            <ExpenditureTable data={expenditureDataSheet} />
            </section>
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
      </main>
    </div>;
};
export default Index;
