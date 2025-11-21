import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UtilityUsersTaxData } from "@/hooks/useUtilityUsersTaxData";

interface UtilityTaxBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: UtilityUsersTaxData[];
}

export const UtilityTaxBreakdownDialog = ({ open, onOpenChange, data }: UtilityTaxBreakdownDialogProps) => {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Utility Users' Tax Breakdown</DialogTitle>
        </DialogHeader>
        <div className="overflow-auto flex-1">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead className="bg-background border-r-2 border-border w-48 min-w-[12rem]">Combined Category</TableHead>
                <TableHead className="bg-background border-r-2 border-border w-48 min-w-[12rem]">Category</TableHead>
                <TableHead className="bg-background border-r-2 border-border w-48 min-w-[12rem]">Sub Category</TableHead>
                <TableHead className="text-right bg-background">Oct 23 YTD</TableHead>
                <TableHead className="text-right bg-background border-r-2 border-border">Oct 24 YTD</TableHead>
                <TableHead className="text-right bg-background">Oct 25 YTD</TableHead>
                <TableHead className="text-right bg-background">Oct25 vs Oct24</TableHead>
                <TableHead className="text-right bg-background">YoY Change %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id} className="border-b border-border">
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem]">{row.combinedCategory}</TableCell>
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem]">{row.category}</TableCell>
                  <TableCell className="border-r-2 border-border w-48 min-w-[12rem]">{row.subCategory}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.oct23Ytd)}</TableCell>
                  <TableCell className="text-right border-r-2 border-border">{formatCurrency(row.oct24Ytd)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(row.oct25Ytd)}</TableCell>
                  <TableCell className={`text-right ${row.oct25VsOct24 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {row.oct25VsOct24 >= 0 ? '' : '('}
                    {formatCurrency(Math.abs(row.oct25VsOct24))}
                    {row.oct25VsOct24 < 0 ? ')' : ''}
                  </TableCell>
                  <TableCell className={`text-right ${row["yoYChange %"] >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(row["yoYChange %"])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
