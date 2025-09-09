import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData } from "@/types/expenditure";
import { ArrowUpDown } from "lucide-react";
import { useState } from "react";

interface ExpenditureTableProps {
  data: ExpenditureData[];
}

type SortField = keyof ExpenditureData;
type SortDirection = 'asc' | 'desc';

export const ExpenditureTable = ({ data }: ExpenditureTableProps) => {
  const [sortField, setSortField] = useState<SortField>('category');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort data alphabetically by category by default
  const sortedData = [...data].sort((a, b) => {
    if (sortField === 'category') {
      const aCategory = (a.category || '').toString().trim();
      const bCategory = (b.category || '').toString().trim();
      
      // Handle empty categories - put them at the end
      if (!aCategory && !bCategory) return 0;
      if (!aCategory) return 1;
      if (!bCategory) return -1;
      
      return sortDirection === 'asc' 
        ? aCategory.localeCompare(bCategory)
        : bCategory.localeCompare(aCategory);
    }
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </TableHead>
  );

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Expenditure Analysis Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-hidden">
          <div className="rounded-md border border-border">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[140px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('category')}>
                      <span>Category</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[80px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('account')}>
                      <span>Account</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2024</TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2025</TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2026</TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[140px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('notes')}>
                      <span>Notes</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[100px]">
                    <div className="flex items-center space-x-1 cursor-pointer text-xs" onClick={() => handleSort('fy24VsFy25')}>
                      <span>FY24 vs FY25</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[100px]">
                    <div className="flex items-center space-x-1 cursor-pointer text-xs" onClick={() => handleSort('fy25VsFy26')}>
                      <span>FY25 vs FY26</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[80px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('fy2024')}>
                      <span>FY2024</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[80px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('fy2025')}>
                      <span>FY2025</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[80px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('fy2026')}>
                      <span>FY2026</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                </TableRow>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Adopt Budget</TableHead>
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Expenditures</TableHead>
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Adopt Budget</TableHead>
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Expenditures</TableHead>
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Adopt Budget</TableHead>
                  <TableHead className="text-xs text-center p-1 min-w-[80px]">Expenditures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow key={row.id || index} className="border-border hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-foreground p-2">
                      {row.category || 'Subcategory'}
                    </TableCell>
                    <TableCell className="text-muted-foreground p-2">
                      {row.account?.toString() || ''}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.adoptBudget || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.expenditures || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.adoptBudget || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.expenditures || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.adoptBudget || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right p-2">
                      {formatCurrency(row.expenditures || 0)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs p-2">
                      {row.notes || ''}
                    </TableCell>
                    <TableCell className={`font-medium text-right p-2 text-xs ${
                      row.fy24VsFy25 > 0 ? 'text-success' : 
                      row.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatPercentage(row.fy24VsFy25 || 0)}
                    </TableCell>
                    <TableCell className={`font-medium text-right p-2 text-xs ${
                      row.fy25VsFy26 > 0 ? 'text-success' : 
                      row.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatPercentage(row.fy25VsFy26 || 0)}
                    </TableCell>
                    <TableCell className={`font-medium text-right p-2 text-xs ${
                      row.fy2024 > 0 ? 'text-success' : 
                      row.fy2024 < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatPercentage(row.fy2024 || 0)}
                    </TableCell>
                    <TableCell className={`font-medium text-right p-2 text-xs ${
                      row.fy2025 > 0 ? 'text-success' : 
                      row.fy2025 < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatPercentage(row.fy2025 || 0)}
                    </TableCell>
                    <TableCell className={`font-medium text-right p-2 text-xs ${
                      row.fy2026 > 0 ? 'text-success' : 
                      row.fy2026 < 0 ? 'text-destructive' : 'text-muted-foreground'
                    }`}>
                      {formatPercentage(row.fy2026 || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};