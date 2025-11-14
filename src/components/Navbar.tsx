import { useState } from "react";
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
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-white/70 hover:text-white transition-colors">
                <HelpCircle className="h-6 w-6" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>About This Dashboard</DialogTitle>
                <DialogDescription className="space-y-4 pt-4">
                  <p>
                    This dashboard provides a comprehensive view of the City of Los Angeles 
                    FY2026 General Fund Revenue and Expenditure data.
                  </p>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Real-time revenue tracking and year-over-year comparisons</li>
                      <li>Budget progress monitoring through October 2025</li>
                      <li>Detailed expenditure analysis by department</li>
                      <li>Interactive charts and data tables</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Data Source:</h4>
                    <p>
                      All data is sourced from the Los Angeles City Controller's Office 
                      and updated regularly to reflect the most current financial information.
                    </p>
                  </div>
                  <p className="text-sm">
                    For more information, visit{" "}
                    <a 
                      href="https://controller.lacity.gov" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      controller.lacity.gov
                    </a>
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
