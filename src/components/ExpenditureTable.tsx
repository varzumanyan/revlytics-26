import React, { useState } from "react";
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

  // Group data by departments and their subcategories
  const groupedData = () => {
    const groups: Array<{ department: ExpenditureData; subcategories: ExpenditureData[] }> = [];
    let currentDepartment: ExpenditureData | null = null;
    let currentSubcategories: ExpenditureData[] = [];

    data.forEach((item) => {
      if (item.category && item.category.trim() !== '') {
        // This is a department - save previous group and start new one
        if (currentDepartment) {
          groups.push({ department: currentDepartment, subcategories: currentSubcategories });
        }
        currentDepartment = item;
        currentSubcategories = [];
      } else if (currentDepartment) {
        // This is a subcategory under the current department
        currentSubcategories.push(item);
      }
    });

    // Add the last group
    if (currentDepartment) {
      groups.push({ department: currentDepartment, subcategories: currentSubcategories });
    }

    return groups;
  };

  const sortedGroupedData = groupedData().sort((a, b) => {
    if (sortField === 'category') {
      return sortDirection === 'asc' 
        ? a.department.category.localeCompare(b.department.category)
        : b.department.category.localeCompare(a.department.category);
    }
    
    const aValue = a.department[sortField];
    const bValue = b.department[sortField];
    
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
        <div className="w-full max-h-[600px] overflow-auto border border-border rounded-md">
          <div className="min-w-[1200px]">
            <Table className="w-full text-sm relative">
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead rowSpan={2} className="align-bottom p-2 min-w-[140px]">
                    <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('category')}>
                      <span>Category</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2024</TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2025</TableHead>
                  <TableHead className="text-center p-1 min-w-[160px]" colSpan={2}>FY2026</TableHead>
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
                {sortedGroupedData.map((group, groupIndex) => (
                  <React.Fragment key={group.department.id || groupIndex}>
                    {/* Department Header Row */}
                    <TableRow className="border-border hover:bg-muted/30 transition-colors bg-muted/20">
                      <TableCell className="font-bold text-foreground p-2 bg-muted/30">
                        {group.department.category}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.adoptBudget || 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.expenditures || 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.adoptBudget || 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.expenditures || 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.adoptBudget || 0)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.expenditures || 0)}
                      </TableCell>
                      <TableCell className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy24VsFy25 > 0 ? 'text-success' : 
                        group.department.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy24VsFy25 || 0)}
                      </TableCell>
                      <TableCell className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy25VsFy26 > 0 ? 'text-success' : 
                        group.department.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy25VsFy26 || 0)}
                      </TableCell>
                      <TableCell className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy2024 > 0 ? 'text-success' : 
                        group.department.fy2024 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy2024 || 0)}
                      </TableCell>
                      <TableCell className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy2025 > 0 ? 'text-success' : 
                        group.department.fy2025 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy2025 || 0)}
                      </TableCell>
                      <TableCell className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy2026 > 0 ? 'text-success' : 
                        group.department.fy2026 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy2026 || 0)}
                      </TableCell>
                    </TableRow>
                    
                    {/* Subcategory Rows */}
                    {group.subcategories.map((row, subIndex) => (
                      <TableRow key={`${groupIndex}-${subIndex}`} className="border-border hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium text-foreground p-2 pl-6">
                          {row.account?.toString() || 'Subcategory'}
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
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};