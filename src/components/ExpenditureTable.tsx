import React, { useState } from "react";
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

  return (
    <Card className="bg-gradient-card border-border shadow-soft w-full resize-none">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          Expenditure Analysis Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-auto max-h-[600px] border border-border rounded-md relative">
          <table 
            className="w-full text-sm border-separate border-spacing-0" 
            style={{ minWidth: '1800px', tableLayout: 'fixed' }}
          >
            <thead>
              <tr style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'hsl(var(--background))' }}>
                <th 
                  rowSpan={2} 
                  className="align-bottom p-2 border-r-2 border-muted text-left"
                  style={{ 
                    position: 'sticky', 
                    left: 0, 
                    zIndex: 101, 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '140px',
                    width: '140px'
                  }}
                >
                  <div className="flex items-center space-x-1 cursor-pointer" onClick={() => handleSort('category')}>
                    <span>Category</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th 
                  className="text-center p-1 border-r-2 border-muted" 
                  colSpan={2}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '160px'
                  }}
                >
                  FY2024
                </th>
                <th 
                  className="text-center p-1 border-r-2 border-muted" 
                  colSpan={2}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '160px'
                  }}
                >
                  FY2025
                </th>
                <th 
                  className="text-center p-1 border-r-2 border-muted" 
                  colSpan={2}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '160px'
                  }}
                >
                  FY2026
                </th>
                <th 
                  className="text-center p-1 border-r-2 border-muted" 
                  colSpan={3}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '180px'
                  }}
                >
                  Fiscal YTD % Budget Utilization
                </th>
                <th 
                  className="text-center p-1 border-r-2 border-muted" 
                  colSpan={2}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '120px'
                  }}
                >
                  Prior FY % Budget Utilization
                </th>
                <th 
                  className="text-center p-1" 
                  colSpan={2}
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '200px'
                  }}
                >
                  Y-o-Y Operating Budget Change
                </th>
              </tr>
              <tr style={{ position: 'sticky', top: '48px', zIndex: 99, backgroundColor: 'hsl(var(--background))' }}>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Adopt Budget
                </th>
                <th 
                  className="text-xs text-center p-1 border-r-2 border-muted"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Expenditures
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Adopt Budget
                </th>
                <th 
                  className="text-xs text-center p-1 border-r-2 border-muted"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Expenditures
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Adopt Budget
                </th>
                <th 
                  className="text-xs text-center p-1 border-r-2 border-muted"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '80px'
                  }}
                >
                  Expenditures
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '60px'
                  }}
                >
                  FY24
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '60px'
                  }}
                >
                  FY25
                </th>
                <th 
                  className="text-xs text-center p-1 border-r-2 border-muted"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '60px'
                  }}
                >
                  FY26
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '60px'
                  }}
                >
                  FY2024
                </th>
                <th 
                  className="text-xs text-center p-1 border-r-2 border-muted"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '60px'
                  }}
                >
                  FY2025
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '100px'
                  }}
                >
                  FY24 vs FY25
                </th>
                <th 
                  className="text-xs text-center p-1"
                  style={{ 
                    backgroundColor: 'hsl(var(--background))',
                    minWidth: '100px'
                  }}
                >
                  FY25 vs FY26
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedGroupedData.map((group, groupIndex) => (
                <React.Fragment key={group.department.id || groupIndex}>
                  {/* Department Header Row */}
                  <tr className="border-border hover:bg-muted/30 transition-colors bg-muted/20 border-b-2 border-muted">
                    <td 
                      className="font-bold text-foreground p-2 border-r-2 border-muted"
                      style={{ 
                        position: 'sticky', 
                        left: 0, 
                        zIndex: 20, 
                        backgroundColor: 'hsl(var(--background))'
                      }}
                    >
                      {group.department.category}
                    </td>
                    <td className="text-muted-foreground text-right p-2 bg-muted/30">
                      {formatCurrency(group.department.adoptBudget || 0)}
                    </td>
                      <td className="text-muted-foreground text-right p-2 bg-muted/30 border-r-2 border-muted">
                        {formatCurrency(group.department.expenditures || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.adoptBudget || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 bg-muted/30 border-r-2 border-muted">
                        {formatCurrency(group.department.expenditures || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 bg-muted/30">
                        {formatCurrency(group.department.adoptBudget || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 bg-muted/30 border-r-2 border-muted">
                        {formatCurrency(group.department.expenditures || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        (group.department as any).fiscalyear24 > 0 ? 'text-success' : 
                        (group.department as any).fiscalyear24 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((group.department as any).fiscalyear24 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        (group.department as any).fiscalyear25 > 0 ? 'text-success' : 
                        (group.department as any).fiscalyear25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((group.department as any).fiscalyear25 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 border-r-2 border-muted ${
                        (group.department as any).fiscalyear26 > 0 ? 'text-success' : 
                        (group.department as any).fiscalyear26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((group.department as any).fiscalyear26 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy2024 > 0 ? 'text-success' : 
                        group.department.fy2024 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy2024 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 border-r-2 border-muted ${
                        group.department.fy2025 > 0 ? 'text-success' : 
                        group.department.fy2025 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy2025 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy24VsFy25 > 0 ? 'text-success' : 
                        group.department.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy24VsFy25 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs bg-muted/30 ${
                        group.department.fy25VsFy26 > 0 ? 'text-success' : 
                        group.department.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(group.department.fy25VsFy26 || 0)}
                      </td>
                  </tr>
                  
                  {/* Subcategory Rows */}
                  {group.subcategories.map((row, subIndex) => (
                    <tr key={`${groupIndex}-${subIndex}`} className="border-border hover:bg-muted/30 transition-colors border-b-2 border-muted">
                      <td 
                        className="font-medium text-foreground p-2 pl-6 border-r-2 border-muted"
                        style={{ 
                          position: 'sticky', 
                          left: 0, 
                          zIndex: 20, 
                          backgroundColor: 'hsl(var(--background))'
                        }}
                      >
                        {row.account?.toString() || 'Subcategory'}
                      </td>
                      <td className="text-muted-foreground text-right p-2">
                        {formatCurrency(row.adoptBudget || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 border-r-2 border-muted">
                        {formatCurrency(row.expenditures || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2">
                        {formatCurrency(row.adoptBudget || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 border-r-2 border-muted">
                        {formatCurrency(row.expenditures || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2">
                        {formatCurrency(row.adoptBudget || 0)}
                      </td>
                      <td className="text-muted-foreground text-right p-2 border-r-2 border-muted">
                        {formatCurrency(row.expenditures || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs ${
                        (row as any).fiscalyear24 > 0 ? 'text-success' : 
                        (row as any).fiscalyear24 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((row as any).fiscalyear24 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs ${
                        (row as any).fiscalyear25 > 0 ? 'text-success' : 
                        (row as any).fiscalyear25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((row as any).fiscalyear25 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs border-r-2 border-muted ${
                        (row as any).fiscalyear26 > 0 ? 'text-success' : 
                        (row as any).fiscalyear26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage((row as any).fiscalyear26 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs ${
                        row.fy2024 > 0 ? 'text-success' : 
                        row.fy2024 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(row.fy2024 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs border-r-2 border-muted ${
                        row.fy2025 > 0 ? 'text-success' : 
                        row.fy2025 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(row.fy2025 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs ${
                        row.fy24VsFy25 > 0 ? 'text-success' : 
                        row.fy24VsFy25 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(row.fy24VsFy25 || 0)}
                      </td>
                      <td className={`font-medium text-right p-2 text-xs ${
                        row.fy25VsFy26 > 0 ? 'text-success' : 
                        row.fy25VsFy26 < 0 ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {formatPercentage(row.fy25VsFy26 || 0)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};