import kennethMejiaLogo from "@/assets/kenneth-mejia-logo.png";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-white/70 hover:text-white transition-colors">
                  <HelpCircle className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  This dashboard displays real-time FY2026 General Fund Revenue and Expenditure data 
                  for the City of Los Angeles.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </nav>
  );
};
