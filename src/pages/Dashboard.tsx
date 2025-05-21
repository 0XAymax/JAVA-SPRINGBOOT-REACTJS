
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  Building, 
  CalendarCheck, 
  UserCheck,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  getEmployees, 
  getDepartments, 
  getLeaveRequests,
  getEmployeeLeaveRequests
} from "@/lib/api";
import { Employee, Department, LeaveRequest } from "@/types";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        if (isAdmin) {
          // Admin sees all data
          const [empData, deptData, leaveData] = await Promise.all([
            getEmployees(),
            getDepartments(),
            getLeaveRequests()
          ]);
          
          setEmployees(empData);
          setDepartments(deptData);
          setLeaveRequests(leaveData);
        } else {
          // Employee sees only their leave requests
          const leaveData = await getEmployeeLeaveRequests(user?.id || "");
          setLeaveRequests(leaveData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin, user?.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-company-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-company-blue mb-6">
        {isAdmin ? "Admin Dashboard" : "Employee Dashboard"}
      </h1>

      {isAdmin ? (
        <AdminDashboard 
          employees={employees} 
          departments={departments} 
          leaveRequests={leaveRequests} 
        />
      ) : (
        <EmployeeDashboard 
          userId={user?.id || ""} 
          leaveRequests={leaveRequests} 
        />
      )}
    </div>
  );
}

function AdminDashboard({ 
  employees, 
  departments, 
  leaveRequests 
}: { 
  employees: Employee[]; 
  departments: Department[]; 
  leaveRequests: LeaveRequest[];
}) {
  const activeEmployees = employees.filter(emp => emp.status === "ACTIVE").length;
  const pendingLeaveRequests = leaveRequests.filter(req => req.status === "PENDING").length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-company-success flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                {activeEmployees} active
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Leave Requests</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLeaveRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(
                employees.reduce((sum, emp) => sum + emp.salary, 0) / 
                (employees.length || 1)
              ).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Leave Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {leaveRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2 font-medium">Employee</th>
                      <th className="px-4 py-2 font-medium">Type</th>
                      <th className="px-4 py-2 font-medium">Dates</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.slice(0, 5).map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-2">{request.employeeName}</td>
                        <td className="px-4 py-2">{request.type}</td>
                        <td className="px-4 py-2">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            request.status === "APPROVED" && "bg-company-success/20 text-company-success",
                            request.status === "PENDING" && "bg-company-warning/20 text-company-warning",
                            request.status === "REJECTED" && "bg-company-danger/20 text-company-danger"
                          )}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No leave requests found.</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {departments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2 font-medium">Department</th>
                      <th className="px-4 py-2 font-medium">Manager</th>
                      <th className="px-4 py-2 font-medium text-right">Employees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td className="px-4 py-2">{dept.name}</td>
                        <td className="px-4 py-2">{dept.managerName}</td>
                        <td className="px-4 py-2 text-right">{dept.employeeCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No departments found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function EmployeeDashboard({ 
  userId, 
  leaveRequests 
}: { 
  userId: string; 
  leaveRequests: LeaveRequest[];
}) {
  const upcomingLeave = leaveRequests.find(
    req => 
      req.status === "APPROVED" && 
      new Date(req.startDate) > new Date()
  );
  
  const pendingRequests = leaveRequests.filter(req => req.status === "PENDING").length;
  const approvedRequests = leaveRequests.filter(req => req.status === "APPROVED").length;
  const rejectedRequests = leaveRequests.filter(req => req.status === "REJECTED").length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My Leave Requests</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.length}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs flex items-center gap-1 text-company-warning">
                <span className="h-2 w-2 rounded-full bg-company-warning" />
                {pendingRequests} pending
              </span>
              <span className="text-xs flex items-center gap-1 text-company-success">
                <span className="h-2 w-2 rounded-full bg-company-success" />
                {approvedRequests} approved
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {upcomingLeave && (
          <Card className="border-l-4 border-l-company-success">
            <CardHeader>
              <CardTitle>Upcoming Approved Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Type:</span>
                  <span>{upcomingLeave.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date Range:</span>
                  <span>
                    {new Date(upcomingLeave.startDate).toLocaleDateString()} - {new Date(upcomingLeave.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reason:</span>
                  <span>{upcomingLeave.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Comments:</span>
                  <span>{upcomingLeave.comments || "No comments"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>My Leave History</CardTitle>
          </CardHeader>
          <CardContent>
            {leaveRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2 font-medium">Type</th>
                      <th className="px-4 py-2 font-medium">Start Date</th>
                      <th className="px-4 py-2 font-medium">End Date</th>
                      <th className="px-4 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-4 py-2">{request.type}</td>
                        <td className="px-4 py-2">
                          {new Date(request.startDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          {new Date(request.endDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs",
                            request.status === "APPROVED" && "bg-company-success/20 text-company-success",
                            request.status === "PENDING" && "bg-company-warning/20 text-company-warning",
                            request.status === "REJECTED" && "bg-company-danger/20 text-company-danger"
                          )}>
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted-foreground">No leave requests found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
