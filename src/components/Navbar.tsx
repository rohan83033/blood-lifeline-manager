import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Droplet } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Droplet className="h-8 w-8 text-accent" />
            <span className="text-xl font-bold text-foreground">BloodBank+</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/register" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Donate Blood
            </Link>
            <Link to="/request" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Request Blood
            </Link>
            <Link to="/inventory" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Inventory
            </Link>
          </div>

          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
