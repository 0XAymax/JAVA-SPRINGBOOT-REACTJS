
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { User, Calendar, Mail, Phone, Building, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  if (!user) return null;

  const handleChangePassword = () => {
    setPasswordError("");

    if (!currentPassword.trim()) {
      setPasswordError("Current password is required");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // In a real app, we would call an API to change the password
    // For now, we'll just show a toast
    
    toast({
      title: "Success",
      description: "Password changed successfully",
    });
    
    setIsPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // Mock user data for the profile
  const employeeData = {
    id: user.id,
    name: user.name,
    position: "Software Engineer",
    department: "Engineering",
    email: user.email,
    phone: "555-1234",
    address: "123 Main St, San Francisco, CA 94105",
    hireDate: "2022-03-15",
    employeeId: "EMP-001",
    manager: "John Manager",
    status: "ACTIVE"
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-company-blue mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-center">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="h-32 w-32 rounded-full bg-company-blue/10 flex items-center justify-center mb-4">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={employeeData.name} 
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-16 w-16 text-company-blue" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{employeeData.name}</h2>
                <p className="text-muted-foreground">{employeeData.position}</p>
                <div className={cn(
                  "mt-2 px-3 py-1 rounded-full text-xs font-medium",
                  employeeData.status === "ACTIVE" ? "bg-company-success/20 text-company-success" : "bg-company-danger/20 text-company-danger"
                )}>
                  {employeeData.status}
                </div>

                <div className="w-full mt-6 space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div>{employeeData.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{employeeData.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="text-sm text-muted-foreground">Department</div>
                      <div>{employeeData.department}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="text-sm text-muted-foreground">Hire Date</div>
                      <div>{new Date(employeeData.hireDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-muted-foreground mr-3" />
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="text-sm">{employeeData.address}</div>
                    </div>
                  </div>
                </div>

                <Button 
                  className="mt-6 w-full"
                  onClick={() => setIsPasswordDialogOpen(true)}
                >
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Employee ID</Label>
                  <div className="font-medium">{employeeData.employeeId}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Full Name</Label>
                  <div className="font-medium">{employeeData.name}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Position</Label>
                  <div className="font-medium">{employeeData.position}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <div className="font-medium">{employeeData.department}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Manager</Label>
                  <div className="font-medium">{employeeData.manager}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <div className="font-medium">{employeeData.status}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="font-medium">{employeeData.email}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone Number</Label>
                  <div className="font-medium">{employeeData.phone}</div>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Address</Label>
                  <div className="font-medium">{employeeData.address}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Contact Name</Label>
                  <div className="font-medium">Jane Smith</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Relationship</Label>
                  <div className="font-medium">Spouse</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Phone Number</Label>
                  <div className="font-medium">555-9876</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <div className="font-medium">jane.smith@example.com</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {passwordError && (
              <p className="text-sm text-destructive">{passwordError}</p>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleChangePassword}>
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
