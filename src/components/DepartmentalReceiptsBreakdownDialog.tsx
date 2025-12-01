import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DepartmentalReceiptsData } from "@/hooks/useDepartmentalReceiptsData";
import { useMemo, useState } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface DepartmentalReceiptsBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DepartmentalReceiptsData[];
}

export const DepartmentalReceiptsBreakdownDialog = ({ open, onOpenChange, data }: DepartmentalReceiptsBreakdownDialogProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  // Dynamically get column headers from the first row
  const columns = useMemo(() => {
    if (data.length === 0) return [];
    const firstRow = data[0];
    return Object.keys(firstRow).filter(key => key !== 'id');
  }, [data]);

  const getColumnType = (key: string, value: any) => {
    if (key.toLowerCase().includes('change') || key.toLowerCase().includes('yoy')) {
      return 'percentage';
    }
    if (typeof value === 'number' && !key.toLowerCase().includes('%')) {
      return 'currency';
    }
    if (key.toLowerCase().includes('%') || (typeof value === 'number' && value < 1 && value > -1)) {
      return 'percentage';
    }
    return 'text';
  };

  const formatColumnHeader = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
      .replace(/\bfy\b/gi, "FY")
      .replace(/\bytd\b/gi, "YTD");
  };

  const shouldHaveRightBorder = (column: string, index: number) => {
    // Add vertical separator after Sub Category column (index 2) and after YTD columns
    const lowerColumn = column.toLowerCase();
    return lowerColumn.includes('subcategory') || lowerColumn.includes('ytd');
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !data) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare based on type
      let comparison = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Departmental Receipts Breakdown</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                {columns.map((column, index) => {
                  const isFirstColumn = index === 0;
                  return (
                    <TableHead 
                      key={column}
                      onClick={() => handleSort(column)}
                      className={`bg-background cursor-pointer hover:bg-muted/50 ${isFirstColumn ? 'w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : ''} ${getColumnType(column, data[0]?.[column]) !== 'text' ? 'text-right' : ''} ${shouldHaveRightBorder(column, index) ? 'border-r-2 border-border' : ''}`}
                    >
                      <div className="flex items-center gap-1">
                        {formatColumnHeader(column)}
                        {sortColumn === column ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-50" />
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, index) => (
                <TableRow key={row.id || index} className="border-b border-border">
                  {columns.map((column, columnIndex) => {
                    const value = row[column];
                    const type = getColumnType(column, value);
                    let formattedValue: string;
                    let cellClass = '';
                    const isFirstColumn = columnIndex === 0;

                    if (type === 'currency' && typeof value === 'number') {
                      formattedValue = formatCurrency(value);
                      cellClass = 'text-right';
                    } else if (type === 'percentage' && typeof value === 'number') {
                      formattedValue = formatPercentage(value);
                      cellClass = `text-right ${value >= 0 ? 'text-green-600' : 'text-red-600'}`;
                    } else {
                      formattedValue = String(value || '');
                    }

                    const borderClass = shouldHaveRightBorder(column, columnIndex) ? 'border-r-2 border-border' : '';
                    
                    return (
                      <TableCell key={column} className={`${isFirstColumn ? 'w-48 min-w-[12rem] max-w-[12rem] whitespace-normal break-words' : ''} ${cellClass} ${borderClass}`}>
                        {formattedValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
