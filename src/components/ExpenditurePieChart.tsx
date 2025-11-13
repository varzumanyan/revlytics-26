import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ExpenditurePieChartProps {
  data: ExpenditureData[];
}

export const ExpenditurePieChart = ({ data }: ExpenditurePieChartProps) => {
  // Find the total rows for the pie chart
  const totalDeptRow = data.find(item => 
    item.generalFundDepartment?.toLowerCase() === 'total department'
  );
  const totalOtherRow = data.find(item => 
    item.generalFundDepartment?.toLowerCase() === 'total other'
  );

  const chartData = [
    {
      name: 'Department Expenses',
      value: totalDeptRow?.october2025Ytd || 0,
      budget: totalDeptRow?.fy26AdoptedBudget || 0,
    },
    {
      name: 'Other Expenses',
      value: totalOtherRow?.october2025Ytd || 0,
      budget: totalOtherRow?.fy26AdoptedBudget || 0,
    }
  ];

  const COLORS = ['#41ffca', '#FFCA41'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / (chartData[0].value + chartData[1].value)) * 100).toFixed(1);
    return `${entry.name}: ${percent}%`;
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Expenditure Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={renderCustomLabel}
              outerRadius={120}
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
                backgroundColor: '#ffffff',
                border: '2px solid #333333',
                borderRadius: '8px',
                color: '#000000',
                padding: '12px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
              }}
              labelStyle={{
                color: '#000000',
                fontWeight: '700',
                marginBottom: '6px',
                fontSize: '15px'
              }}
              itemStyle={{
                color: '#000000',
                fontWeight: '600'
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value, entry: any) => {
                const item = chartData.find(d => d.name === value);
                return `${value}: ${formatCurrency(item?.value || 0)}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
