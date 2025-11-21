import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TransientOccupancyTaxData } from "@/hooks/useTransientOccupancyTaxData";
import { useMemo } from "react";

interface TransientOccupancyTaxBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: TransientOccupancyTaxData[];
}

export const TransientOccupancyTaxBreakdownDialog = ({ open, onOpenChange, data }: TransientOccupancyTaxBreakdownDialogProps) => {
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
      .trim();
  };

  const shouldHaveRightBorder = (column: string, index: number) => {
    // Add vertical separator after % columns (end of fiscal year sections)
    const isPercentageColumn = column.toLowerCase().includes('%') || 
                                column.toLowerCase().includes('percent') ||
                                column.toLowerCase().includes('pct');
    return isPercentageColumn;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Transient Occupancy Tax Breakdown</DialogTitle>
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
                      className={`bg-background ${isFirstColumn ? 'w-48 min-w-[12rem]' : ''} ${getColumnType(column, data[0]?.[column]) !== 'text' ? 'text-right' : ''} ${shouldHaveRightBorder(column, index) ? 'border-r-2 border-border' : ''}`}
                    >
                      {formatColumnHeader(column)}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
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
                      <TableCell key={column} className={`${isFirstColumn ? 'w-48 min-w-[12rem]' : ''} ${cellClass} ${borderClass}`}>
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
