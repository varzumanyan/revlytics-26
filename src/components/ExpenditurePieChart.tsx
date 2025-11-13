import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenditurePieChartProps {
  data: ExpenditureData[];
}

export const ExpenditurePieChart = ({ data }: ExpenditurePieChartProps) => {
  // Filter out total rows and prepare data for the pie chart
  const filteredData = data
    .filter(item => {
      const dept = item.generalFundDepartment?.toLowerCase() || '';
      return dept && 
        !dept.includes('total') && 
        !dept.includes('general fund other') &&
        item.october2025Ytd > 0;
    })
    .sort((a, b) => b.october2025Ytd - a.october2025Ytd);
  
  // Take top 15 departments
  const top15 = filteredData.slice(0, 15);
  
  // Group the rest as "Other"
  const otherTotal = filteredData
    .slice(15)
    .reduce((sum, item) => sum + item.october2025Ytd, 0);
  
  const chartData = [
    ...top15.map(item => ({
      name: item.generalFundDepartment.length > 25 
        ? item.generalFundDepartment.substring(0, 25) + '...' 
        : item.generalFundDepartment,
      value: item.october2025Ytd,
      budget: item.fy26AdoptedBudget,
    })),
    ...(otherTotal > 0 ? [{
      name: 'Other Departments',
      value: otherTotal,
      budget: 0,
    }] : [])
  ];

  // Generate a color palette for all departments
  const COLORS = [
    '#41ffca', '#FFCA41', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DFE6E9', '#74B9FF', '#A29BFE',
    '#FD79A8', '#FDCB6E', '#6C5CE7', '#00B894', '#E17055',
    '#FFB6C1'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);
  
  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / totalValue) * 100).toFixed(1);
    // Only show label if percentage is significant enough
    return parseFloat(percent) > 3 ? `${percent}%` : '';
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Expenditure Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="40%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '2px solid #41ffca',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '500'
              }}
              labelStyle={{
                color: '#ffffff',
                fontWeight: '600',
                marginBottom: '4px'
              }}
              itemStyle={{
                color: '#ffffff'
              }}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ 
                color: 'hsl(var(--foreground))',
                fontSize: '12px',
                maxHeight: '400px',
                overflowY: 'auto',
                paddingLeft: '10px'
              }}
              formatter={(value, entry: any) => {
                const item = chartData.find(d => d.name === value);
                return `${value}`;
              }}
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
