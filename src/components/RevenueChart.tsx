import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { ApiFieldMapper } from "@/utils/apiFieldMapper";
import { getRevenueCategoryDescription } from "@/utils/revenueCategoryDescriptions";
import { getFiscalPeriodThroughLabel } from "@/utils/dashboardConfig";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";


interface RevenueChartProps {
  data: RevenueData[];
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  console.log('RevenueChart received data:', data);
  console.log('Data length:', data?.length);
  
  const [selectedCategory, setSelectedCategory] = useState<string>("Sales Tax");
  const [open, setOpen] = useState(false);
  const [clickedPieSegment, setClickedPieSegment] = useState<string | null>(null);

  // Display name mapping for renaming categories in the UI
  const displayNameMapping: Record<string, string> = {
    "Transfer from Budget Stabilization Fund": "Transfer from Reserve or Budget Stabilization Fund",
  };

  const getDisplayName = (name: string) => displayNameMapping[name] || name;

  // Subtitle description (pulled from the same Excel-backed mapping used by the table dialog)
  const getPieSubtitle = () => {
    const baseText = getFiscalPeriodThroughLabel();

    if (!clickedPieSegment) {
      return `${baseText} • Click a slice to see its description`;
    }

    const description = getRevenueCategoryDescription(clickedPieSegment);

    // If we don't have a description for that slice, at least show the (possibly renamed) category name
    return `${baseText} • ${description ?? getDisplayName(clickedPieSegment)}`;
  };

  // Get dynamic field information
  const dateFields = useMemo(() => {
    const fields = ApiFieldMapper.getDateFields(data);
    console.log('RevenueChart dateFields:', fields);
    return fields;
  }, [data]);
  
  const fieldMappings = useMemo(() => ApiFieldMapper.generateFieldMappings(data), [data]);
  
  // Filter out Monthly Total and get available categories
  const availableCategories = data
    .filter(item => item.revenueType !== "Monthly Total")
    .map(item => item.revenueType);
  
  console.log('Available categories:', availableCategories);

  // Prepare data for the pie chart (FY2026 revenue breakdown)
  const pieChartData = useMemo(() => {
    if (!dateFields || !dateFields.year3) {
      console.log('No dateFields.year3, returning empty array');
      return [];
    }
    
    console.log('Building pie chart with year3 field:', dateFields.year3);
    
    return data
      .filter(item => item.revenueType !== "Monthly Total" && item.revenueType !== "Revenue to Date")
      .map(item => ({
        name: item.revenueType,
        value: (item as any)[dateFields.year3] || 0,
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [data, dateFields]);

  console.log('Pie chart data:', pieChartData);

  // Prepare data for the bar chart (selected category only)
  const topRevenueData = useMemo(() => {
    if (!dateFields) {
      console.log('No dateFields for bar chart');
      return [];
    }
    
    const barData = data
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
    
    console.log('Bar chart data for', selectedCategory, ':', barData);
    return barData;
  }, [data, selectedCategory, dateFields]);

  // Colors for pie chart
  const COLORS = [
    'hsl(var(--chart-primary))',
    'hsl(var(--chart-secondary))',
    'hsl(var(--chart-tertiary))',
    'hsl(170, 100%, 60%)',
    'hsl(200, 100%, 60%)',
    'hsl(230, 100%, 60%)',
    'hsl(260, 100%, 60%)',
    'hsl(290, 100%, 60%)',
    'hsl(320, 100%, 60%)',
    'hsl(350, 100%, 60%)',
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };




  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-gradient-card border-border shadow-soft" role="region" aria-label="FY2026 YTD Revenue Breakdown">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              FY2026 YTD Revenue Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              {getPieSubtitle()}
            </p>
          </CardHeader>
          <CardContent>
            <div role="img" aria-label={`Pie chart showing revenue breakdown by category. ${pieChartData.map(d => `${d.name}: ${formatCurrency(d.value)}`).join(', ')}`}>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  onClick={(data) => setClickedPieSegment(data.name)}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    if (percent < 0.03) return null; // Hide labels for very small slices
                    const RADIAN = Math.PI / 180;
                    const radius = outerRadius + 30;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    const name = pieChartData[index].name;
                    const shortName = name.length > 20 ? name.substring(0, 20) + '...' : name;
                    const color = COLORS[index % COLORS.length];
                    
                    return (
                      <text 
                        x={x} 
                        y={y} 
                        fill={color}
                        textAnchor={x > cx ? 'start' : 'end'} 
                        dominantBaseline="central"
                        fontSize="11"
                        fontWeight="500"
                      >
                        {shortName}
                      </text>
                    );
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length > 0) {
                      const item = payload[0];
                      return (
                        <div className="bg-popover border border-border rounded-md p-3 shadow-md">
                          <p className="text-foreground font-medium">{item.name}</p>
                          <p className="text-foreground">
                            Value: <span className="font-semibold">{formatCurrency(item.value as number)}</span>
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {((item.value as number / pieChartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-gradient-card border-border shadow-soft" role="region" aria-label="Revenue Source by Year">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">
                Revenue Source by Year
              </CardTitle>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select revenue category"
                    className="w-48 justify-between"
                  >
                    {selectedCategory || "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
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
            <ResponsiveContainer width="100%" height={400}>
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
    </div>
  );
};
