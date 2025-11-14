import { useRevenueData } from "@/hooks/useRevenueData";
import { useExpenditureData } from "@/hooks/useExpenditureData";
import { Navbar } from "@/components/Navbar";
import { RevenueCard } from "@/components/RevenueCard";
import { BudgetProgressGauge } from "@/components/BudgetProgressGauge";
import { RevenueTable } from "@/components/RevenueTable";
import { RevenueChart } from "@/components/RevenueChart";
import { ExpenditureCard } from "@/components/ExpenditureCard";
import { ExpenditureTable } from "@/components/ExpenditureTable";
import { ExpenditureChart } from "@/components/ExpenditureChart";
import { ExpenditurePieChart } from "@/components/ExpenditurePieChart";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
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

  const revenueDataSheet = revenueData?.revenue || [];
  const expenditureDataSheet = expenditureData?.expenses || [];

  console.log('Revenue data sheet:', revenueDataSheet);
  console.log('Number of revenue items:', revenueDataSheet.length);

  // Calculate summary metrics - use the Revenue to Date row for accurate totals
  const monthlyTotalRow = revenueDataSheet.find(item => item.revenueType === "Revenue to Date");
  console.log('Revenue to Date Row:', monthlyTotalRow);
  
  // Get dynamic field references for calculations
  const dateFields = ApiFieldMapper.getDateFields(revenueDataSheet);
  console.log('Date fields detected:', dateFields);
  
  const totalRevenue2025 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year3] || 0 : 0;
  const totalRevenue2024 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year2] || 0 : 0;
  const totalRevenue2023 = dateFields ? (monthlyTotalRow as any)?.[dateFields.year1] || 0 : 0;
  console.log('Total revenue values:', { totalRevenue2023, totalRevenue2024, totalRevenue2025 });
  
  const yearOverYearChange = totalRevenue2024 > 0 ? (totalRevenue2025 - totalRevenue2024) / totalRevenue2024 : 0;
  const totalBudget = monthlyTotalRow?.["fy2026\nadoptedBudget"] || 0;
  const budgetProgress = totalBudget > 0 ? totalRevenue2025 / totalBudget : 0;

  // Calculate expenditure metrics for FY2026 only - filter to main departments only to avoid double counting
  // Find the Total Expenses row for accurate metrics
  const totalExpensesRow = expenditureDataSheet.find(item => 
    item.generalFundDepartment?.toLowerCase() === 'total expenses'
  );
  
  const totalExpenditureBudget = totalExpensesRow?.fy26AdoptedBudget || 0;
  const totalExpenditures = totalExpensesRow?.october2025Ytd || 0;
  const expenditureBudgetUtilization = totalExpenditureBudget > 0 ? totalExpenditures / totalExpenditureBudget : 0;
  
  console.log('Total Expenses Row:', totalExpensesRow);
  console.log('Expenditure metrics:', { totalExpenditureBudget, totalExpenditures, expenditureBudgetUtilization });
  return <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-header shadow-strong">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#41ffca]">
              FY2026 General Fund Revenue &amp; Expense Analysis
            </h1>
            <p className="text-xl max-w-2xl mx-auto text-slate-50">
              General Fund Revenue and Expenditure Overview for Fiscal Year 2026
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-8 space-y-8">
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RevenueCard 
                title="Total Revenue FY2026 YTD" 
                value={totalRevenue2025} 
                isCurrency={true} 
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
                subtitle="Through October 2025 (4 months)"
                actualProgress={budgetProgress}
                monthsElapsed={4}
                totalMonths={12}
              />
              <RevenueCard 
                title="FY2026 Adopted Budget" 
                value={totalBudget} 
                isCurrency={true} 
              />
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
                title="YTD Expenditures (July to Oct 2025)"
                value={totalExpenditures}
                isCurrency={true}
                description="Year-to-date spending"
              />
              <BudgetProgressGauge
                title="Budget Utilization"
                actualProgress={expenditureBudgetUtilization}
                monthsElapsed={4}
                totalMonths={12}
                subtitle="FY2026 adopted budget"
                isExpenditure={true}
              />
              <ExpenditureCard
                title="Remaining Adopted Budget"
                value={totalExpenditureBudget - totalExpenditures}
                isCurrency={true}
                description="Available for remainder of FY"
              />
            </div>

            {/* Expenditure Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenditureChart data={expenditureDataSheet} />
              <ExpenditurePieChart data={expenditureDataSheet} />
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