import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      .replace(/\bytd\b/gi, "YTD")
      .replace(/\boct\b/gi, "Nov")
      .replace(/\bOct\b/g, "Nov");
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
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Departmental Receipts Breakdown</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background sticky top-0 z-10">
              <tr>
                {columns.map((column, index) => {
                  const columnType = getColumnType(column, data[0]?.[column]);
                  return (
                    <th
                      key={column}
                      onClick={() => handleSort(column)}
                      className={`px-3 py-2 cursor-pointer hover:bg-muted/50 w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${columnType !== 'text' ? 'text-right' : 'text-left'} text-xs font-semibold text-foreground ${shouldHaveRightBorder(column, index) ? 'border-r-2 border-border' : ''}`}
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
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-background">
              {sortedData.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-muted/50 border-b border-border">
                  {columns.map((column, columnIndex) => {
                    const value = row[column];
                    const type = getColumnType(column, value);
                    let formattedValue: string;
                    let cellClass = '';

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
                      <td key={column} className={`px-3 py-2 text-sm w-32 min-w-[8rem] max-w-[8rem] whitespace-normal break-words ${cellClass} ${borderClass} text-muted-foreground`}>
                        {formattedValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
