import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from 'react';

interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [selectedCount, setSelectedCount] = useState("6");
  
  // Filter out Monthly Total and sort by revenue amount
  const filteredData = data
    .filter(item => item.revenueType !== "Monthly Total")
    .sort((a, b) => b.july2025 - a.july2025);

  // Prepare data for the bar chart (selected number of top revenue types)
  const topRevenueData = filteredData
    .slice(0, parseInt(selectedCount))
    .map(item => ({
      name: item.revenueType.length > 20 ? 
        item.revenueType.substring(0, 20) + '...' : 
        item.revenueType,
      fullName: item.revenueType,
      july2023: item.july2023 / 1000000, // Convert to millions
      july2024: item.july2024 / 1000000,
      july2025: item.july2025 / 1000000,
    }));

  // Prepare data for the trend line (total revenue over time)
  const totalsByYear = {
    july2023: data.reduce((sum, item) => sum + item.july2023, 0) / 1000000,
    july2024: data.reduce((sum, item) => sum + item.july2024, 0) / 1000000,
    july2025: data.reduce((sum, item) => sum + item.july2025, 0) / 1000000,
  };

  const trendData = [
    { year: '2023', total: totalsByYear.july2023 },
    { year: '2024', total: totalsByYear.july2024 },
    { year: '2025', total: totalsByYear.july2025 },
  ];

  const formatTooltip = (value: number, name: string) => {
    return [`$${value.toFixed(1)}M`, name === 'july2023' ? 'July 2023' : 
            name === 'july2024' ? 'July 2024' : 'July 2025'];
  };

  const formatTrendTooltip = (value: number) => {
    return [`$${value.toFixed(1)}M`, 'Total Revenue'];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-card border-border shadow-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground">
              Top Revenue Sources Comparison
            </CardTitle>
            <Select value={selectedCount} onValueChange={setSelectedCount}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Top 3</SelectItem>
                <SelectItem value="5">Top 5</SelectItem>
                <SelectItem value="6">Top 6</SelectItem>
                <SelectItem value="8">Top 8</SelectItem>
                <SelectItem value="10">Top 10</SelectItem>
                <SelectItem value="15">Top 15</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Revenue (Millions $)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar dataKey="july2023" fill="hsl(var(--chart-primary))" name="July 2023" />
              <Bar dataKey="july2024" fill="hsl(var(--chart-secondary))" name="July 2024" />
              <Bar dataKey="july2025" fill="hsl(var(--chart-tertiary))" name="July 2025" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">
            Total Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="year" 
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                fontSize={12}
                stroke="hsl(var(--muted-foreground))"
                label={{ value: 'Revenue (Millions $)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                formatter={formatTrendTooltip}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: 'hsl(var(--accent))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};