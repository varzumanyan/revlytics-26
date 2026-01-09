import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getRevenueCategoryDescription } from "@/utils/revenueCategoryDescriptions";

interface RevenueCategoryDescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryName: string;
}

export const RevenueCategoryDescriptionDialog = ({
  open,
  onOpenChange,
  categoryName,
}: RevenueCategoryDescriptionDialogProps) => {
  const description = getRevenueCategoryDescription(categoryName);

  if (!description) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {categoryName}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-4 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
