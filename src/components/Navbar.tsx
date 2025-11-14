import { useState, useEffect } from "react";
import kennethMejiaLogo from "@/assets/kenneth-mejia-logo.png";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const Navbar = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const hasSeenDialog = localStorage.getItem('hasSeenAboutDialog');
    if (!hasSeenDialog) {
      setIsDialogOpen(true);
      localStorage.setItem('hasSeenAboutDialog', 'true');
    }
  }, []);

  return (
    <nav className="w-full bg-black border-b border-border/10">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <a 
            href="https://controller.lacity.gov" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src={kennethMejiaLogo} 
              alt="Kenneth Mejia - LA City Controller" 
              className="h-10"
            />
          </a>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-white/70 hover:text-white transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About This Dashboard</DialogTitle>
                <DialogDescription className="space-y-4 pt-4 text-foreground/90">
                  <p>
                    This dashboard provides a high-level view of the City of LA's FY2026 
                    General Fund Revenues and Expenditures. FY2026 goes from July 1, 2025, to June 
                    30, 2026.
                  </p>
                  <p>
                    The General Fund is the primary operating fund of the City. General 
                    Fund revenues are derived from such sources as taxes, licenses, permits, fees, 
                    fines, intergovernmental revenues, charges for services, special assessments, 
                    interest income, and other resources available for discretionary funding. 
                    Expenditures are made for functions of general government, protection of 
                    persons and property, public works, health and sanitation, transportation, 
                    cultural and recreational services, community development, capital outlay, and debt 
                    service.
                  </p>
                  <p>
                    <strong className="text-foreground">NOTE:</strong> General Fund Expenditures show a higher budget than Revenues due 
                    to Special Fund transfers (~$1.38B) that will occur during the fiscal year to supplement 
                    the General Fund Revenue budget of $8.178B.
                  </p>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </nav>
  );
};
