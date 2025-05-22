import { useAuth } from "@/context/AuthContext";
import { Link, useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut, 
  Users, 
  Building, 
  Calendar, 
  UserCheck,
  User,
  CalendarCheck,
  FileText,
  Home,
  LayoutDashboard,
  Building2,
  DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
};

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
      active
        ? "bg-sidebar-accent text-sidebar-accent-foreground"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const isAdmin = user.role === "ADMIN";
  const navItems = isAdmin
    ? [
        {
          to: "/dashboard",
          icon: <Home className="w-5 h-5" />,
          label: "Dashboard",
        },
        {
          to: "/employees",
          icon: <Users className="w-5 h-5" />,
          label: "Employees",
        },
        {
          to: "/departments",
          icon: <Building className="w-5 h-5" />,
          label: "Departments",
        },
        {
          to: "/leave-requests",
          icon: <CalendarCheck className="w-5 h-5" />,
          label: "Leave Requests",
        },
        {
          to: "/salary",
          icon: <DollarSign className="w-5 h-5" />,
          label: "Salary",
        },
      ]
    : [
        {
          to: "/dashboard",
          icon: <Home className="w-5 h-5" />,
          label: "Dashboard",
        },
        {
          to: "/profile",
          icon: <User className="w-5 h-5" />,
          label: "My Profile",
        },
        {
          to: "/my-leave",
          icon: <Calendar className="w-5 h-5" />,
          label: "My Leave",
        },
        {
          to: "/directory",
          icon: <FileText className="w-5 h-5" />,
          label: "Directory",
        },
      ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground">
        <div className="p-6 flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-company-purple" />
          <h1 className="text-xl font-bold">EMS Portal</h1>
        </div>

        <div className="px-4 py-2 text-sm text-sidebar-foreground/70">Navigation</div>

        <nav className="p-2 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.to}
            />
          ))}
        </nav>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-company-purple" />
            <h1 className="text-lg font-bold">EMS Portal</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              {isMobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </>
              )}
            </svg>
          </Button>
        </header>

        {/* Mobile navigation drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-xs bg-sidebar p-6 shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-company-purple" />
                  <h1 className="text-xl font-bold text-sidebar-foreground">EMS Portal</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sidebar-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </Button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    active={location.pathname === item.to}
                  />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sidebar-foreground">{user.name}</p>
                    <p className="text-xs text-sidebar-foreground/70">{user.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={logout}
                    className="ml-auto text-sidebar-foreground/70 hover:text-sidebar-foreground"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
          </div>
        )}

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
