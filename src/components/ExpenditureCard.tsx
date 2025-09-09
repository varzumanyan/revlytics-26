import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ExpenditureCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  description?: string;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

export const ExpenditureCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  description,
  isCurrency = false,
  isPercentage = false
}: ExpenditureCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatValue = (val: string | number) => {
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
      return `${(val * 100).toFixed(1)}%`;
    }
    
    return val.toLocaleString();
  };

  return (
    <Card className="bg-gradient-card border-border shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{formatValue(value)}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};