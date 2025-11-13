import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenditureChartProps {
  data: ExpenditureData[];
}

export const ExpenditureChart = ({ data }: ExpenditureChartProps) => {
  // Filter out total rows and prepare data for the chart
  const chartData = data
    .filter(item => {
      const dept = item.generalFundDepartment?.toLowerCase() || '';
      return dept && 
        !dept.includes('total') && 
        !dept.includes('general fund other') &&
        item.october2025Ytd > 0;
    })
    .sort((a, b) => b.october2025Ytd - a.october2025Ytd)
    .slice(0, 10) // Top 10 departments
    .map(item => ({
      name: item.generalFundDepartment.length > 20 
        ? item.generalFundDepartment.substring(0, 20) + '...' 
        : item.generalFundDepartment,
      'YTD Spending': item.october2025Ytd,
      'Budget': item.fy26AdoptedBudget,
      'Utilization %': (item["%OfFy26Budget"] * 100),
    }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Top 10 Departments by YTD Spending
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Bar dataKey="YTD Spending" fill="hsl(var(--primary))" />
            <Bar dataKey="Budget" fill="hsl(var(--muted))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
