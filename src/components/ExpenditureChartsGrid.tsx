import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData, getExpenditureYtdFields } from "@/types/expenditure";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { useState, useMemo } from 'react';
import { cn } from "@/lib/utils";
import { getDashboardConfig, getFiscalPeriodThroughLabel, getYtdLabels } from "@/utils/dashboardConfig";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDepartmentDescription } from "@/utils/departmentDescriptions";

interface ExpenditureChartsGridProps {
  data: ExpenditureData[];
}

export const ExpenditureChartsGrid = ({ data }: ExpenditureChartsGridProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [dialogDepartment, setDialogDepartment] = useState<{ name: string; description: string } | null>(null);
  const dashConfig = getDashboardConfig();
  const ytdLabels = getYtdLabels(dashConfig);

  // Filter out total rows and get available departments
  const availableDepartments = useMemo(() => {
    return data
      .filter(item => {
        const dept = item.generalFundDepartment?.toLowerCase() || '';
        return dept && 
          !dept.includes('total') && 
          !dept.includes('general fund other') &&
          item.december2025Ytd > 0;
      })
      .map(item => item.generalFundDepartment)
      .sort();
  }, [data]);

  // Set initial department if not set
  if (!selectedDepartment && availableDepartments.length > 0) {
    setSelectedDepartment(availableDepartments[0]);
  }

  // Prepare data for the pie chart (FY2026 expenditure breakdown)
  const pieChartData = useMemo(() => {
    const filteredData = data
      .filter(item => {
        const dept = item.generalFundDepartment?.toLowerCase() || '';
        return dept && 
          !dept.includes('total') && 
          !dept.includes('general fund other') &&
          item.december2025Ytd > 0;
      })
      .sort((a, b) => b.december2025Ytd - a.december2025Ytd);
    
    // Take top 15 departments
    const top15 = filteredData.slice(0, 15);
    
    // Group the rest as "Other"
    const otherTotal = filteredData
      .slice(15)
      .reduce((sum, item) => sum + item.december2025Ytd, 0);
    
    return [
      ...top15.map(item => ({
        name: item.generalFundDepartment.length > 25 
          ? item.generalFundDepartment.substring(0, 25) + '...' 
          : item.generalFundDepartment,
        fullName: item.generalFundDepartment,
        value: item.december2025Ytd,
      })),
      ...(otherTotal > 0 ? [{
        name: 'Other',
        fullName: 'Other',
        value: otherTotal,
      }] : [])
    ];
  }, [data]);

  // Prepare data for the bar chart (selected department across years)
  const barChartData = useMemo(() => {
    const selectedItem = data.find(item => item.generalFundDepartment === selectedDepartment);
    
    if (!selectedItem) return [];
    
    return [{
      name: selectedDepartment.length > 20 ? 
        selectedDepartment.substring(0, 20) + '...' : 
        selectedDepartment,
      fullName: selectedDepartment,
      [ytdLabels[0]]: Number(selectedItem.december2023Ytd) / 1000000,
      [ytdLabels[1]]: Number(selectedItem.december2024Ytd) / 1000000,
      [ytdLabels[2]]: selectedItem.december2025Ytd / 1000000,
    }];
  }, [data, selectedDepartment]);

  // Colors for pie chart
  const COLORS = [
    '#41ffca', '#FFCA41', '#4169E1', '#4ECDC4', '#45B7D1',
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

  const handlePieClick = (data: any) => {
    const description = getDepartmentDescription(data.fullName);
    if (description) {
      setDialogDepartment({ name: data.fullName, description });
    }
  };

  const handleDepartmentClick = (department: string) => {
    // Check if it's one of the General categories
    const generalCategories = ["General", "General Services", "General Service", "General City Purposes"];
    const isGeneralCategory = generalCategories.some(cat => department.includes(cat));
    
    if (isGeneralCategory) {
      // Show combined popup for all General categories
      const combinedDescription = `
General: Spending includes the Tax Revenue Anticipatory Note, Accessible Housing Fund, Emergency Operations Fund, Rec & Park Fund, Library Fund, Arts & Cultural Fund, Sidewalk Repair Fund, Sewer and Construction Maintenance Fund, and more

General Service: City Department that provides internal support for City programs in the delivery of services to City residents. Services include the following: fleet, building services, procurement and stores inventory, fuel, construction and alterations, custodial, real estate, mail and messenger, parking, emergency management and special event coordination, materials testing, and printing services

General City Purposes: Spending includes the Homelessness Emergency Account, Medicare and Social Security Contributions, Council Projects, and Community Services Districts
      `.trim();
      
      setDialogDepartment({ name: "General Categories", description: combinedDescription });
    } else {
      const description = getDepartmentDescription(department);
      if (description) {
        setDialogDepartment({ name: department, description });
      }
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              FY2026 YTD Expenditure Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-2">
              {getFiscalPeriodThroughLabel(dashConfig)}
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                    if (percent < 0.03) return null;
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
                  onClick={(data) => handleDepartmentClick(data.fullName)}
                  cursor="pointer"
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
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-gradient-card border-border shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-foreground">
                Expenditure Category by Year
              </CardTitle>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-48 justify-between bg-background"
                  >
                    {selectedDepartment 
                      ? (selectedDepartment.length > 15 
                          ? selectedDepartment.substring(0, 15) + '...' 
                          : selectedDepartment)
                      : "Select category..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0 bg-popover">
                  <Command>
                    <CommandInput placeholder="Search departments..." />
                    <CommandEmpty>No department found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {availableDepartments.map((department) => {
                        const description = getDepartmentDescription(department);
                        const generalCategories = ["General", "General Services", "General Service", "General City Purposes"];
                        const hasDescription = description || generalCategories.some(cat => department.includes(cat));
                        
                        return (
                          <CommandItem
                            key={department}
                            value={department}
                            onSelect={() => {
                              setSelectedDepartment(department);
                              setOpen(false);
                            }}
                            className="group"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4 shrink-0",
                                selectedDepartment === department ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <span 
                              className={cn(
                                "flex-1",
                                hasDescription && "cursor-pointer hover:text-primary transition-colors"
                              )}
                              onClick={(e) => {
                                if (hasDescription) {
                                  e.stopPropagation();
                                  setSelectedDepartment(department);
                                  setOpen(false);
                                  handleDepartmentClick(department);
                                }
                              }}
                            >
                              {department}
                            </span>
                            {hasDescription && (
                              <Info 
                                className="h-4 w-4 ml-2 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDepartment(department);
                                  setOpen(false);
                                  handleDepartmentClick(department);
                                }}
                              />
                            )}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }} barCategoryGap="30%" maxBarSize={60}>
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
                  label={{ value: 'Expenditure (Millions $)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  shared={false}
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
                              {item.name}: 
                            </span>
                            <span className="ml-1 font-semibold" style={{ color: item.color }}>
                              {formatCurrency((item.value as number) * 1000000)}
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
                    paddingTop: '10px'
                  }}
                />
                <Bar dataKey={ytdLabels[0]} fill="hsl(var(--chart-primary))" />
                <Bar dataKey={ytdLabels[1]} fill="hsl(var(--chart-secondary))" />
                <Bar dataKey={ytdLabels[2]} fill="hsl(var(--chart-tertiary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Description Dialog */}
      <Dialog open={!!dialogDepartment} onOpenChange={() => setDialogDepartment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogDepartment?.name}</DialogTitle>
            <DialogDescription className="pt-4 text-foreground/90 whitespace-pre-line">
              {dialogDepartment?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
