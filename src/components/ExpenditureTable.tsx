import React, { useState, useMemo } from "react";
import { getDashboardConfig, getYtdLabels, getChangeLabel } from "@/utils/dashboardConfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenditureData, getExpenditureYtdFields } from "@/types/expenditure";
import { ArrowUpDown, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getDepartmentDescription } from "@/utils/departmentDescriptions";
import { getEndpointForDepartment } from "@/utils/expenditureDepartmentMapping";
import { useExpenditureDepartmentBreakdown } from "@/hooks/useExpenditureDepartmentBreakdown";
import { ExpenditureDepartmentBreakdownDialog } from "@/components/ExpenditureDepartmentBreakdownDialog";

interface ExpenditureTableProps {
  data: ExpenditureData[];
}

type SortField = keyof ExpenditureData;
type SortDirection = 'asc' | 'desc';

export const ExpenditureTable = ({ data }: ExpenditureTableProps) => {
  const dashConfig = getDashboardConfig();
  const ytdLabels = getYtdLabels(dashConfig);
  const expFields = useMemo(() => getExpenditureYtdFields(data), [data]);
  const [sortField, setSortField] = useState<SortField>('generalFundDepartment');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [fy24Collapsed, setFy24Collapsed] = useState(true);
  const [fy25Collapsed, setFy25Collapsed] = useState(true);
  const [dialogDepartment, setDialogDepartment] = useState<{ name: string; description: string } | null>(null);

  const [breakdownDialogOpen, setBreakdownDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  
  const departmentEndpoint = selectedDepartment ? getEndpointForDepartment(selectedDepartment) : null;
  const { data: breakdownData = [], isLoading: breakdownLoading } = useExpenditureDepartmentBreakdown(departmentEndpoint);
  
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

  const handleDepartmentClick = (department: string, event: React.MouseEvent) => {
    // Check if clicked element or its parent has data-breakdown-click attribute
    const target = event.target as HTMLElement;
    const isBreakdownClick = target.closest('[data-breakdown-click]');
    
    if (isBreakdownClick) {
      // Handle breakdown dialog
      const endpoint = getEndpointForDepartment(department);
      if (endpoint) {
        setSelectedDepartment(department);
        setBreakdownDialogOpen(true);
      }
      return;
    }
    
    // Check if it's one of the General categories for description dialog
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

  const sortedData = [...data]
    .filter(item => {
      // Remove rows with empty department names or rows that shouldn't be displayed
      const dept = item.generalFundDepartment?.toLowerCase() || '';
      // Filter out empty rows or any problematic rows between Total Other and Total Expenses
      return dept && dept.trim().length > 0;
    })
    .sort((a, b) => {
    // If sorting by department name or default, use custom order
    if (sortField === 'generalFundDepartment') {
      // Add safety checks for undefined values
      const aDept = a.generalFundDepartment || '';
      const bDept = b.generalFundDepartment || '';
      
      const aOrder = getRowOrder(aDept);
      const bOrder = getRowOrder(bDept);
      
      // If both have special ordering, use that
      if (aOrder !== 0 || bOrder !== 0) {
        return sortDirection === 'asc' ? aOrder - bOrder : bOrder - aOrder;
      }
      
      // Otherwise alphabetical for regular departments
      return sortDirection === 'asc'
        ? aDept.localeCompare(bDept)
        : bDept.localeCompare(aDept);
    }
    
    // For other fields, use normal sorting
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    // Handle undefined/null values
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
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

  // Helper functions to identify row types
  const isGrandTotal = (department: string) => {
    return department?.toLowerCase() === 'total expenses';
  };

  const isSubtotal = (department: string) => {
    const lower = department?.toLowerCase() || '';
    return lower === 'total department' || lower === 'total other';
  };

  const isSectionHeader = (department: string) => {
    return department?.toLowerCase() === 'general fund other expenses';
  };

  const isSubItem = (department: string) => {
    const lower = department?.toLowerCase() || '';
    const subItems = [
      'capital finance administration',
      'capital improvement expense',
      'general',
      'general city purposes',
      'human resources benefits',
      'leasing',
      'liability claims',
      'petroleum products',
      'unappropriated balance',
      'water and electricity'
    ];
    return subItems.includes(lower);
  };

  const isTotalRow = (department: string) => {
    return isGrandTotal(department) || isSubtotal(department) || isSectionHeader(department);
  };

  const SortableHeader = ({ field, children, className = "", isFirstColumn = false }: { field: SortField; children: React.ReactNode; className?: string; isFirstColumn?: boolean }) => (
    <th 
      className={`px-2 lg:px-3 py-1.5 lg:py-2 text-left text-[10px] lg:text-xs font-semibold text-foreground cursor-pointer hover:bg-muted/50 transition-colors border-b border-border bg-background sticky top-0 z-30 ${isFirstColumn ? 'w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : ''} ${className}`}
      onClick={() => handleSort(field)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSort(field);
        }
      }}
      tabIndex={0}
      role="button"
      aria-sort={sortField === field ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
      aria-label={`Sort by ${children}, currently ${sortField === field ? sortDirection : 'not sorted'}`}
    >
      <div className="flex items-center space-x-1">
        <span className="leading-tight">{children}</span>
        <ArrowUpDown className="h-2.5 w-2.5 lg:h-3 lg:w-3 flex-shrink-0" aria-hidden="true" />
      </div>
    </th>
  );

  return (
    <>
    <Card className="bg-gradient-card border-border shadow-soft w-full" role="region" aria-label="Year to date General Fund expenditure analysis">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-foreground">
          YTD GF Expenditure Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative overflow-x-auto table-scroll-container" role="region" aria-label="Scrollable expenditure data table" tabIndex={0}>
          <div className="max-h-[600px] overflow-y-auto border border-border rounded-md">
            <table className="min-w-full divide-y divide-border w-max lg:w-full" aria-label="Expenditure data by department and fiscal year">
                <thead className="sticky top-0 z-20 bg-background shadow-sm">
                  <tr>
                    <SortableHeader field="generalFundDepartment" className="border-r-2 border-muted-foreground/30" isFirstColumn={true}>General Fund Department</SortableHeader>

                    {fy24Collapsed ? (
                      <th
                        className="px-1 lg:px-2 py-1.5 lg:py-2 text-center text-[10px] lg:text-xs font-semibold text-foreground bg-background sticky top-0 z-30 border-b border-border border-r-2 border-muted-foreground/30 w-10 min-w-[2.5rem] max-w-[2.5rem]"
                      >
                        <button
                          onClick={() => setFy24Collapsed(false)}
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                          aria-label="Expand FY24 columns"
                        >
                          <Plus className="h-3 w-3" /> FY24
                        </button>
                      </th>
                    ) : (
                      <>
                        <th className="px-1 py-1.5 lg:py-2 text-center bg-background sticky top-0 z-30 border-b border-border w-6 min-w-[1.5rem]">
                          <button onClick={() => setFy24Collapsed(true)} className="hover:text-primary" aria-label="Collapse FY24 columns">
                            <Minus className="h-3 w-3" />
                          </button>
                        </th>
                        <SortableHeader field={(expFields?.year1 || 'february2024Ytd') as SortField}>{ytdLabels[0]}</SortableHeader>
                        <SortableHeader field="fy24AdoptedBudget">FY24 Adopted Budget</SortableHeader>
                        <SortableHeader field="%OfFy24Budget" className="border-r-2 border-muted-foreground/30">% as of FY24 Budget</SortableHeader>
                      </>
                    )}

                    {fy25Collapsed ? (
                      <th
                        className="px-1 lg:px-2 py-1.5 lg:py-2 text-center text-[10px] lg:text-xs font-semibold text-foreground bg-background sticky top-0 z-30 border-b border-border border-r-2 border-muted-foreground/30 w-10 min-w-[2.5rem] max-w-[2.5rem]"
                      >
                        <button
                          onClick={() => setFy25Collapsed(false)}
                          className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                          aria-label="Expand FY25 columns"
                        >
                          <Plus className="h-3 w-3" /> FY25
                        </button>
                      </th>
                    ) : (
                      <>
                        <th className="px-1 py-1.5 lg:py-2 text-center bg-background sticky top-0 z-30 border-b border-border w-6 min-w-[1.5rem]">
                          <button onClick={() => setFy25Collapsed(true)} className="hover:text-primary" aria-label="Collapse FY25 columns">
                            <Minus className="h-3 w-3" />
                          </button>
                        </th>
                        <SortableHeader field={(expFields?.year2 || 'february2025Ytd') as SortField}>{ytdLabels[1]}</SortableHeader>
                        <SortableHeader field="fy25AdoptedBudget">FY25 Adopted Budget</SortableHeader>
                        <SortableHeader field="%OfFy25Budget" className="border-r-2 border-muted-foreground/30">% as of FY25 Budget</SortableHeader>
                      </>
                    )}

                    <SortableHeader field={(expFields?.year3 || 'february2026Ytd') as SortField}>{ytdLabels[2]}</SortableHeader>
                    <SortableHeader field="fy26AdoptedBudget">FY26 Adopted Budget</SortableHeader>
                    <SortableHeader field="%OfFy26Budget" className="border-r-2 border-muted-foreground/30">% as of FY26 Budget</SortableHeader>
                    <SortableHeader field={"__yoyChange" as SortField}>{getChangeLabel(dashConfig)}</SortableHeader>
                    <SortableHeader field={"__yoyPct" as SortField}>YoY % Change</SortableHeader>
                  </tr>
                </thead>


                <tbody className="divide-y divide-border">
                  {sortedData.map((row, index) => {
                    const ytd1Key = expFields?.year1 || 'february2024Ytd';
                    const ytd2Key = expFields?.year2 || 'february2025Ytd';
                    const ytd3Key = expFields?.year3 || 'february2026Ytd';
                    
                    const dec2023 = typeof row[ytd1Key] === 'string' && row[ytd1Key] === '' ? 0 : Number(row[ytd1Key] || 0);
                    const fy24Budget = typeof row.fy24AdoptedBudget === 'string' && row.fy24AdoptedBudget === '' ? 0 : Number(row.fy24AdoptedBudget);
                    const pctFy24 = typeof row["%OfFy24Budget"] === 'string' && row["%OfFy24Budget"] === '' ? 0 : Number(row["%OfFy24Budget"]);
                    
                    const dec2024 = typeof row[ytd2Key] === 'string' && row[ytd2Key] === '' ? 0 : Number(row[ytd2Key] || 0);
                    const fy25Budget = typeof row.fy25AdoptedBudget === 'string' && row.fy25AdoptedBudget === '' ? 0 : Number(row.fy25AdoptedBudget);
                    const pctFy25 = typeof row["%OfFy25Budget"] === 'string' && row["%OfFy25Budget"] === '' ? 0 : Number(row["%OfFy25Budget"]);
                    
                    const dec2025 = Number(row[ytd3Key] || 0);
                    const fy26Budget = row.fy26AdoptedBudget;
                    const pctFy26 = row["%OfFy26Budget"];
                    
                    const isTotal = isTotalRow(row.generalFundDepartment);
                    const isGrand = isGrandTotal(row.generalFundDepartment);
                    const isSub = isSubtotal(row.generalFundDepartment);
                    const isSection = isSectionHeader(row.generalFundDepartment);
                    const isSubItemRow = isSubItem(row.generalFundDepartment);
                    
                    // Add spacing before section headers and totals
                    const needsSpacingBefore = isSub || isSection || isGrand;
                    
                    return (
                      <React.Fragment key={row.id}>
                  {needsSpacingBefore && (
                    <tr className="h-3">
                      <td colSpan={1 + (fy24Collapsed ? 1 : 4) + (fy25Collapsed ? 1 : 4) + 3 + 2} className="border-0 bg-background"></td>
                    </tr>
                  )}

                        <tr 
                          className={`transition-colors ${
                            isGrand ? 'bg-primary/10 hover:bg-primary/15 font-bold border-t-2 border-primary' :
                            isSub ? 'bg-muted/50 hover:bg-muted/60 font-semibold border-t border-border' :
                            isSection ? 'bg-muted/30 hover:bg-muted/40 font-semibold' :
                            'hover:bg-muted/30'
                          }`}
                        >
                          <td className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words border-r-2 border-muted-foreground/30 ${
                            isGrand ? 'bg-primary/10 hover:bg-primary/15 text-foreground font-bold' :
                            isSub ? 'bg-muted/50 hover:bg-muted/60 text-foreground font-semibold' :
                            isSection ? 'bg-muted/30 hover:bg-muted/40 text-foreground font-semibold' :
                            isSubItemRow ? 'text-foreground pl-4 lg:pl-8 bg-background hover:bg-muted/30' :
                            'text-foreground bg-background hover:bg-muted/30'
                          }`}>
                            <span
                              className={`${
                                getDepartmentDescription(row.generalFundDepartment) || 
                                ["General", "General Services", "General Service", "General City Purposes"].some(cat => row.generalFundDepartment.includes(cat))
                                  ? 'cursor-pointer hover:text-primary transition-colors'
                                  : ''
                              }`}
                              onClick={(e) => handleDepartmentClick(row.generalFundDepartment, e)}
                            >
                              {row.generalFundDepartment}
                            </span>
                          </td>
                        {!historyCollapsed && (
                          <>
                            <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (dec2023 > 0 && !isNaN(dec2023) ? formatCurrency(dec2023) : '')}
                              </td>
                              <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (fy24Budget > 0 && !isNaN(fy24Budget) ? formatCurrency(fy24Budget) : '')}
                              </td>
                              <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap border-r-2 border-muted-foreground/30 ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${
                                pctFy24 > dashConfig.percentageThreshold ? 'text-destructive font-medium' : isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'
                              } ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (pctFy24 > 0 && !isNaN(pctFy24) ? formatPercentage(pctFy24) : '')}
                              </td>
                              <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (dec2024 > 0 && !isNaN(dec2024) ? formatCurrency(dec2024) : '')}
                              </td>
                              <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (fy25Budget > 0 && !isNaN(fy25Budget) ? formatCurrency(fy25Budget) : '')}
                              </td>
                              <td 
                                className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap border-r-2 border-muted-foreground/30 ${
                                isGrand || isSub ? 'font-bold' : ''
                              } ${
                                pctFy25 > dashConfig.percentageThreshold ? 'text-destructive font-medium' : isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'
                              } ${
                                !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                                  ? 'cursor-pointer hover:underline' 
                                  : ''
                              }`}
                                data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                                onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                              >
                                {isSection ? '' : (pctFy25 > 0 && !isNaN(pctFy25) ? formatPercentage(pctFy25) : '')}
                              </td>
                          </>
                        )}
                          <td 
                            className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                            isGrand || isSub ? 'font-bold' : ''
                          } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                            !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                              ? 'cursor-pointer hover:underline' 
                              : ''
                          }`}
                            data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                            onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                          >
                            {isSection ? '' : (!isNaN(dec2025) && dec2025 !== 0 ? formatCurrency(dec2025) : '')}
                          </td>
                          <td 
                            className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${historyCollapsed ? 'border-r-2 border-muted-foreground/30 ' : ''}${
                            isGrand || isSub ? 'font-bold' : ''
                          } ${isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'} ${
                            !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                              ? 'cursor-pointer hover:underline' 
                              : ''
                          }`}
                            data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                            onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                          >
                            {isSection ? '' : (!isNaN(fy26Budget) && fy26Budget !== 0 ? formatCurrency(fy26Budget) : '')}
                          </td>
                          {!historyCollapsed && (
                          <td 
                            className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap border-r-2 border-muted-foreground/30 ${
                            isGrand || isSub ? 'font-bold' : ''
                          } ${
                            !isNaN(pctFy26) && pctFy26 > dashConfig.percentageThreshold ? 'text-destructive font-medium' : isSection ? 'font-semibold text-muted-foreground' : 'text-muted-foreground'
                          } ${
                            !isTotal && getEndpointForDepartment(row.generalFundDepartment) 
                              ? 'cursor-pointer hover:underline' 
                              : ''
                          }`}
                            data-breakdown-click={!isTotal && getEndpointForDepartment(row.generalFundDepartment) ? "true" : undefined}
                            onClick={(e) => !isTotal && handleDepartmentClick(row.generalFundDepartment, e)}
                          >
                            {isSection ? '' : (!isNaN(pctFy26) && pctFy26 !== 0 ? formatPercentage(pctFy26) : '')}
                          </td>
                          )}
                          {(() => {
                            const yoyChange = dec2025 - dec2024;
                            const yoyPct = dec2024 > 0 ? (dec2025 - dec2024) / dec2024 : 0;
                            const showYoy = !isSection && dec2025 !== 0 && dec2024 !== 0 && !isNaN(dec2025) && !isNaN(dec2024);
                            const changeColor = isGrand || isSub
                              ? 'text-foreground'
                              : yoyChange > 0 ? 'text-destructive' : yoyChange < 0 ? 'text-success' : 'text-muted-foreground';
                            return (
                              <>
                                <td className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                  isGrand || isSub ? 'font-bold' : 'font-medium'
                                } ${changeColor}`}>
                                  {showYoy ? formatCurrency(yoyChange) : ''}
                                </td>
                                <td className={`px-2 lg:px-3 py-1.5 lg:py-2 text-[10px] lg:text-sm text-right whitespace-nowrap ${
                                  isGrand || isSub ? 'font-bold' : 'font-medium'
                                } ${changeColor}`}>
                                  {showYoy ? `${(yoyPct * 100).toFixed(2)}%` : ''}
                                </td>
                              </>
                            );
                          })()}

                        </tr>
                      </React.Fragment>
                    );
                  })}
                 </tbody>
          </table>
          </div>
        </div>
      </CardContent>
    </Card>

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

      {/* Department Breakdown Dialog */}
      <ExpenditureDepartmentBreakdownDialog
        open={breakdownDialogOpen}
        onOpenChange={setBreakdownDialogOpen}
        data={breakdownData}
        departmentName={selectedDepartment || ""}
        isLoading={breakdownLoading}
      />
    </>
  );
};
