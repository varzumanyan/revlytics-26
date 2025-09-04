import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueData } from "@/types/revenue";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
  const [selectedCategory, setSelectedCategory] = useState<string>("Sales Tax");
  const [open, setOpen] = useState(false);
  
  // Filter out Monthly Total and get available categories
  const availableCategories = data
    .filter(item => item.revenueType !== "Monthly Total")
    .map(item => item.revenueType);

  // Prepare data for the bar chart (selected category only)
  const topRevenueData = data
    .filter(item => item.revenueType === selectedCategory)
    .map(item => ({
      name: item.revenueType.length > 20 ? 
        item.revenueType.substring(0, 20) + '...' : 
        item.revenueType,
      fullName: item.revenueType,
      july2023: item.july2023 / 1000000, // Convert to millions
      july2024: item.july2024 / 1000000,
      july2025: item.july2025 / 1000000,
    }));


  const formatTooltip = (value: number, name: string) => {
    return [`$${value.toFixed(1)}M`, name === 'july2023' ? 'July 2023' : 
            name === 'july2024' ? 'July 2024' : 'July 2025'];
  };


  return (
    <div className="w-full">
      <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300 animate-fade-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Revenue Sources Comparison
            </CardTitle>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-64 justify-between hover:bg-accent/10 transition-all duration-200 border-primary/20 hover:border-primary/40"
                >
                  <span className="truncate">{selectedCategory || "Select category..."}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 bg-popover/95 backdrop-blur-sm border-border/50">
                <Command>
                  <CommandInput placeholder="Search revenue categories..." className="border-none focus:ring-0" />
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
                        className="cursor-pointer hover:bg-accent/20 transition-colors duration-200"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-primary",
                            selectedCategory === category ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="truncate">{category}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={topRevenueData} 
              margin={{ top: 30, right: 40, left: 40, bottom: 80 }}
              className="animate-scale-in"
            >
              <defs>
                <linearGradient id="gradient2023" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="gradient2024" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="hsl(var(--chart-secondary))" stopOpacity={0.6}/>
                </linearGradient>
                <linearGradient id="gradient2025" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1}/>
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(var(--border))" 
                strokeOpacity={0.3}
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={13}
                fontWeight={500}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis 
                fontSize={13}
                fontWeight={500}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{ 
                  value: 'Revenue (Millions $)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'hsl(var(--foreground))', fontWeight: 600 }
                }}
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  color: 'hsl(var(--foreground))',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '14px',
                  fontWeight: 500
                }}
                cursor={{ fill: 'hsl(var(--accent))', fillOpacity: 0.1 }}
              />
              <Bar 
                dataKey="july2023" 
                fill="url(#gradient2023)" 
                name="July 2023"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
              <Bar 
                dataKey="july2024" 
                fill="url(#gradient2024)" 
                name="July 2024"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
              <Bar 
                dataKey="july2025" 
                fill="url(#gradient2025)" 
                name="July 2025"
                radius={[4, 4, 0, 0]}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-6 p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-primary"></div>
              <span className="text-sm font-medium text-muted-foreground">July 2023</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-chart-secondary"></div>
              <span className="text-sm font-medium text-muted-foreground">July 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary"></div>
              <span className="text-sm font-medium text-muted-foreground">July 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};