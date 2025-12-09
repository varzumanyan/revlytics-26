import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDepartmentDescription } from "@/utils/departmentDescriptions";

interface ExpenditureChartProps {
  data: ExpenditureData[];
}

export const ExpenditureChart = ({ data }: ExpenditureChartProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<{ name: string; description: string } | null>(null);
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
      fullName: item.generalFundDepartment,
      'YTD Spending': item.october2025Ytd,
      'Budget': item.fy26AdoptedBudget,
      'Utilization %': (item["%OfFy26Budget"] * 100),
    }));

  const handleBarClick = (data: any) => {
    const description = getDepartmentDescription(data.fullName);
    if (description) {
      setSelectedDepartment({ name: data.fullName, description });
    }
  };

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
          Top GF YTD Spending (July - Nov 2025)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
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
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const item = payload[0];
                  return (
                    <div className="bg-popover border border-border rounded-md p-3 shadow-md">
                      <p className="text-foreground font-medium mb-2">{item.payload.fullName}</p>
                      <p className="text-foreground">
                        <span 
                          className="font-medium" 
                          style={{ color: item.color }}
                        >
                          YTD Spending: 
                        </span>
                        <span className="ml-1 font-semibold" style={{ color: item.color }}>
                          {formatCurrency(item.value as number)}
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ 
                color: 'hsl(var(--foreground))',
                paddingTop: '20px'
              }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar 
              dataKey="YTD Spending" 
              fill="#41ffca" 
              onClick={handleBarClick}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>

      <Dialog open={!!selectedDepartment} onOpenChange={() => setSelectedDepartment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDepartment?.name}</DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              {selectedDepartment?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
