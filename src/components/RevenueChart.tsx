import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";

interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("Sales Tax");
  const [open, setOpen] = useState(false);

  // Get dynamic field information
  const dateFields = useMemo(() => ApiFieldMapper.getDateFields(data), [data]);
  const fieldMappings = useMemo(() => ApiFieldMapper.generateFieldMappings(data), [data]);
  
  // Filter out Monthly Total and get available categories
  const availableCategories = data
    .filter(item => item.revenueType !== "Monthly Total")
    .map(item => item.revenueType);

  // Prepare data for the bar chart (selected category only)
  const topRevenueData = useMemo(() => {
    if (!dateFields) return [];
    
    return data
      .filter(item => item.revenueType === selectedCategory)
      .map(item => {
        const chartData: any = {
          name: item.revenueType.length > 20 ? 
            item.revenueType.substring(0, 20) + '...' : 
            item.revenueType,
          fullName: item.revenueType,
        };
        
        // Dynamically add year data
        if (dateFields.year1) {
          chartData.year1 = ((item as any)[dateFields.year1] || 0) / 1000000;
        }
        if (dateFields.year2) {
          chartData.year2 = ((item as any)[dateFields.year2] || 0) / 1000000;
        }
        if (dateFields.year3) {
          chartData.year3 = ((item as any)[dateFields.year3] || 0) / 1000000;
        }
        
        return chartData;
      });
  }, [data, selectedCategory, dateFields]);




  return (
    <div className="w-full max-w-4xl mx-auto">
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
                  {selectedCategory || "Select category..."}
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
                          setSelectedCategory(category);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCategory === category ? "opacity-100" : "opacity-0"
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
            <BarChart data={topRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="30%" maxBarSize={60}>
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
                cursor={{ fill: 'transparent' }}
                shared={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length > 0) {
                    const item = payload[0];
                    return (
                      <div className="bg-popover border border-border rounded-md p-3 shadow-md">
                        <p className="text-foreground font-medium">{selectedCategory}</p>
                        <p className="text-foreground">
                          <span 
                            className="font-medium" 
                            style={{ color: item.color }}
                          >
                            {item.name}: 
                          </span>
                          <span style={{ color: item.color }}>
                            ${typeof item.value === 'number' ? item.value.toFixed(1) : '0.0'}M
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
                allowEscapeViewBox={{ x: false, y: false }}
              />
               <Legend 
                 wrapperStyle={{ 
                   paddingTop: '20px',
                   fontSize: '12px',
                   color: 'hsl(var(--foreground))'
                 }}
                 formatter={(value) => value}
               />
               {dateFields?.year1 && (
                 <Bar 
                   dataKey="year1" 
                   fill="hsl(var(--chart-primary))" 
                   name={ApiFieldMapper.getDisplayLabel(dateFields.year1, data)} 
                 />
               )}
               {dateFields?.year2 && (
                 <Bar 
                   dataKey="year2" 
                   fill="hsl(var(--chart-secondary))" 
                   name={ApiFieldMapper.getDisplayLabel(dateFields.year2, data)} 
                 />
               )}
               {dateFields?.year3 && (
                 <Bar 
                   dataKey="year3" 
                   fill="hsl(var(--chart-tertiary))" 
                   name={ApiFieldMapper.getDisplayLabel(dateFields.year3, data)} 
                 />
               )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
};