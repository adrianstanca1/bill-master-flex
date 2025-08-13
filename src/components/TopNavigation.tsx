
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import AuthStatusGuest from "@/components/AuthStatusGuest";

export function TopNavigation() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg">UK Construction</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Dashboard
            </Link>
            <Link
              to="/invoices"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Invoices
            </Link>
            <Link
              to="/quotes"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Quotes
            </Link>
            <Link
              to="/advisor"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
              )}
            >
              Advisor
            </Link>
          </nav>

          <AuthStatusGuest />
        </div>
      </div>
    </nav>
  );
}
