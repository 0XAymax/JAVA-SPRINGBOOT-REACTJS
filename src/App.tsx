
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Departments from "./pages/Departments";
import LeaveRequests from "./pages/LeaveRequests";
import Profile from "./pages/Profile";
import MyLeave from "./pages/MyLeave";
import Directory from "./pages/Directory";
import NotFound from "./pages/NotFound";

// Auth Guard component
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={<AuthGuard><Dashboard /></AuthGuard>} 
            />
            <Route 
              path="/employees" 
              element={<AuthGuard><Employees /></AuthGuard>} 
            />
            <Route 
              path="/departments" 
              element={<AuthGuard><Departments /></AuthGuard>} 
            />
            <Route 
              path="/leave-requests" 
              element={<AuthGuard><LeaveRequests /></AuthGuard>} 
            />
            <Route 
              path="/profile" 
              element={<AuthGuard><Profile /></AuthGuard>} 
            />
            <Route 
              path="/my-leave" 
              element={<AuthGuard><MyLeave /></AuthGuard>} 
            />
            <Route 
              path="/directory" 
              element={<AuthGuard><Directory /></AuthGuard>} 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
