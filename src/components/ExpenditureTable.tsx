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
  const [sortField, setSortField] = useState<SortField>('generalFundDepartment');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  console.log('ExpenditureTable received data:', data.length, 'rows');
  console.log('Sample rows:', data.slice(0, 5).map(d => d.generalFundDepartment));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Custom ordering for expenditure data
  const getRowOrder = (dept: string) => {
    if (!dept) return 9999;
    const lower = dept.toLowerCase();
    
    // Total Expenses should be last
    if (lower === 'total expenses') return 10000;
    
    // Total Other should be second to last
    if (lower === 'total other') return 9000;
    
    // General Fund Other Expenses and its items
    if (lower === 'general fund other expenses') return 8000;
    if (lower === 'capital finance administration') return 8001;
    if (lower === 'capital improvement expense') return 8002;
    if (lower === 'general') return 8003;
    if (lower === 'general city purposes') return 8004;
    if (lower === 'human resources benefits') return 8005;
    if (lower === 'leasing') return 8006;
    if (lower === 'liability claims') return 8007;
    if (lower === 'petroleum products') return 8008;
    if (lower === 'unappropriated balance') return 8009;
    if (lower === 'water and electricity') return 8010;
    
    // Total Department after Zoo
    if (lower === 'total department') return 7000;
    
    // All other departments come first
    return 0;
  };

  const sortedData = [...data].sort((a, b) => {
    // If sorting by department name or default, use custom order
    if (sortField === 'generalFundDepartment') {
      const aOrder = getRowOrder(a.generalFundDepartment);
      const bOrder = getRowOrder(b.generalFundDepartment);
      
      // If both have special ordering, use that
      if (aOrder !== 0 || bOrder !== 0) {
        return sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      }
      
      // Otherwise alphabetical for regular departments
      return sortDirection === 'asc'
        ? a.generalFundDepartment.localeCompare(b.generalFundDepartment)
        : b.generalFundDepartment.localeCompare(a.generalFundDepartment);
    }
    
    // For other fields, use normal sorting
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

  const formatCurrency = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    return `${Math.round(numValue * 100)}%`;
  };

  const isTotalRow = (department: string) => {
    if (!department) return false;
    const lowerDept = department.toLowerCase();
    return lowerDept.includes('total') || 
           lowerDept.includes('general fund other') ||
           lowerDept === 'general fund other expenses';
  };

  const SortableHeader = ({ field, children, className = "", isFirstColumn = false }: { field: SortField; children: React.ReactNode; className?: string; isFirstColumn?: boolean }) => (
    <th 
      className={`px-3 py-2 text-left text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors border-b border-border bg-muted/30 sticky top-0 ${isFirstColumn ? 'left-0 z-20' : 'z-10'} ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );

  return (
    <Card className="bg-gradient-card border-border shadow-soft w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          YTD GF Expenditure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden border border-border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead className="sticky top-0 z-10 bg-background">
                  <tr>
                    <SortableHeader field="generalFundDepartment" className="border-r-2 border-muted-foreground/30" isFirstColumn={true}>General Fund Department</SortableHeader>
                    <SortableHeader field="october2023Ytd">October 2023 YTD</SortableHeader>
                    <SortableHeader field="fy24AdoptedBudget">FY24 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy24Budget" className="border-r-2 border-muted-foreground/30">% of FY24 Budget</SortableHeader>
                    <SortableHeader field="october2024Ytd">October 2024 YTD</SortableHeader>
                    <SortableHeader field="fy25AdoptedBudget">FY25 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy25Budget" className="border-r-2 border-muted-foreground/30">% of FY25 Budget</SortableHeader>
                    <SortableHeader field="october2025Ytd">October 2025 YTD</SortableHeader>
                    <SortableHeader field="fy26AdoptedBudget">FY26 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy26Budget">% of FY26 Budget</SortableHeader>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sortedData.map((row) => {
                    const oct2023 = typeof row.october2023Ytd === 'string' && row.october2023Ytd === '' ? 0 : Number(row.october2023Ytd);
                    const fy24Budget = typeof row.fy24AdoptedBudget === 'string' && row.fy24AdoptedBudget === '' ? 0 : Number(row.fy24AdoptedBudget);
                    const pctFy24 = typeof row["%OfFy24Budget"] === 'string' && row["%OfFy24Budget"] === '' ? 0 : Number(row["%OfFy24Budget"]);
                    
                    const oct2024 = typeof row.october2024Ytd === 'string' && row.october2024Ytd === '' ? 0 : Number(row.october2024Ytd);
                    const fy25Budget = typeof row.fy25AdoptedBudget === 'string' && row.fy25AdoptedBudget === '' ? 0 : Number(row.fy25AdoptedBudget);
                    const pctFy25 = typeof row["%OfFy25Budget"] === 'string' && row["%OfFy25Budget"] === '' ? 0 : Number(row["%OfFy25Budget"]);
                    
                    const oct2025 = row.october2025Ytd;
                    const fy26Budget = row.fy26AdoptedBudget;
                    const pctFy26 = row["%OfFy26Budget"];
                    
                    const isTotal = isTotalRow(row.generalFundDepartment);
                    
                    return (
                      <tr 
                        key={row.id} 
                        className="transition-colors hover:bg-muted/30"
                      >
                        <td className="px-3 py-2 text-sm whitespace-nowrap text-foreground border-r-2 border-muted-foreground/30 sticky left-0 bg-background z-10">
                          {row.generalFundDepartment}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {oct2023 > 0 && !isNaN(oct2023) ? formatCurrency(oct2023) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {fy24Budget > 0 && !isNaN(fy24Budget) ? formatCurrency(fy24Budget) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap border-r-2 border-muted-foreground/30 ${
                          pctFy24 > 0.3333 ? 'text-destructive font-medium' : ''
                        }`}>
                          {pctFy24 > 0 && !isNaN(pctFy24) ? formatPercentage(pctFy24) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {oct2024 > 0 && !isNaN(oct2024) ? formatCurrency(oct2024) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap">
                          {fy25Budget > 0 && !isNaN(fy25Budget) ? formatCurrency(fy25Budget) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right text-muted-foreground whitespace-nowrap border-r-2 border-muted-foreground/30 ${
                          pctFy25 > 0.3333 ? 'text-destructive font-medium' : ''
                        }`}>
                          {pctFy25 > 0 && !isNaN(pctFy25) ? formatPercentage(pctFy25) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right whitespace-nowrap text-muted-foreground">
                          {!isNaN(oct2025) ? formatCurrency(oct2025) : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm text-right whitespace-nowrap text-muted-foreground">
                          {!isNaN(fy26Budget) ? formatCurrency(fy26Budget) : '-'}
                        </td>
                        <td className={`px-3 py-2 text-sm text-right whitespace-nowrap ${
                          !isNaN(pctFy26) && pctFy26 > 0.3333 ? 'text-destructive font-medium' : 'text-muted-foreground'
                        }`}>
                          {!isNaN(pctFy26) ? formatPercentage(pctFy26) : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
