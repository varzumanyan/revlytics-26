import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from 'react';
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Utility Users' Tax",
    "Departmental Receipts", 
    "Sales Tax",
    "Business Tax",
    "Documentary Transfer Tax",
    "Property Tax 1%"
  ]);
  const [open, setOpen] = useState(false);
  
  // Filter out Monthly Total and get available categories
  const availableCategories = data
    .filter(item => item.revenueType !== "Monthly Total")
    .map(item => item.revenueType);

  // Prepare data for the bar chart (selected categories only)
  const topRevenueData = data
    .filter(item => selectedCategories.includes(item.revenueType))
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
              Revenue Sources Comparison
            </CardTitle>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-48 justify-between"
                >
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} selected`
                    : "Select categories..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0">
                <Command>
                  <CommandInput placeholder="Search revenue categories..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {availableCategories.map((category) => (
                      <CommandItem
                        key={category}
                        value={category}
                        onSelect={() => {
                          setSelectedCategories(prev => 
                            prev.includes(category)
                              ? prev.filter(item => item !== category)
                              : [...prev, category]
                          );
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategories.includes(category) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {category}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
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