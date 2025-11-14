import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

interface RevenueCardProps {
  title: string;
  value: number | string;
  change?: number;
  isPercentage?: boolean;
  isCurrency?: boolean;
  description?: string;
}

export const RevenueCard = ({ 
  title, 
  value, 
  change, 
  isPercentage = false, 
  isCurrency = true,
  description
}: RevenueCardProps) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(val);
    }
    
    if (isPercentage) {
      return `${(val * 100).toFixed(2)}%`;
    }
    
    return val.toLocaleString();
  };

  const formatChange = (changeVal: number) => {
    if (isPercentage) {
      return `${(changeVal * 100).toFixed(2)}%`;
    }
    return changeVal > 0 ? `+${changeVal.toLocaleString()}` : changeVal.toLocaleString();
  };

  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  return (
    <Card className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <DollarSign className="h-4 w-4 text-accent" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {formatValue(value)}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {change !== undefined && (
          <div className="flex items-center space-x-1 text-xs mt-1">
            {isPositiveChange && (
              <>
                <TrendingUp className="h-3 w-3 text-success" />
                <span className="text-success">{formatChange(change)}</span>
              </>
            )}
            {isNegativeChange && (
              <>
                <TrendingDown className="h-3 w-3 text-destructive" />
                <span className="text-destructive">{formatChange(change)}</span>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};