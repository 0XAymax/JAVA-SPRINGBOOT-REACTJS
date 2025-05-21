
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Employee, Department } from "@/types";
import { getEmployees, getDepartments, createEmployee, updateEmployee, deleteEmployee } from "@/lib/api";
import { Users, UserPlus, Edit, Trash2, Search } from "lucide-react";

const employeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  departmentId: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  hireDate: z.string().min(1, "Hire date is required"),
  salary: z.coerce.number().min(0, "Salary must be a positive number"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();
  
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      position: "",
      hireDate: new Date().toISOString().split("T")[0],
      salary: 0,
      address: "",
      status: "ACTIVE",
    },
  });

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower) ||
      employee.position.toLowerCase().includes(searchLower) ||
      employee.departmentName.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [empData, deptData] = await Promise.all([
          getEmployees(),
          getDepartments(),
        ]);
        setEmployees(empData);
        setDepartments(deptData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load employees and departments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const openNewEmployeeDialog = () => {
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      departmentId: "",
      position: "",
      hireDate: new Date().toISOString().split("T")[0],
      salary: 0,
      address: "",
      status: "ACTIVE",
    });
    setEditingEmployee(null);
    setIsDialogOpen(true);
  };

  const openEditEmployeeDialog = (employee: Employee) => {
    const department = departments.find(dept => dept.id === employee.departmentId);
    
    form.reset({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      departmentId: employee.departmentId,
      position: employee.position,
      hireDate: employee.hireDate,
      salary: employee.salary,
      address: employee.address,
      status: employee.status,
    });
    setEditingEmployee(employee);
    setIsDialogOpen(true);
  };

  const confirmDelete = (employee: Employee) => {
    setDeletingEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!deletingEmployee) return;
    
    try {
      await deleteEmployee(deletingEmployee.id);
      setEmployees(employees.filter(e => e.id !== deletingEmployee.id));
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingEmployee(null);
    }
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    try {
      const departmentName = departments.find(dept => dept.id === data.departmentId)?.name || "";
      
      if (editingEmployee) {
        // Update existing employee
        const updatedEmployee = await updateEmployee(editingEmployee.id, {
          ...data,
          departmentName
        });
        setEmployees(employees.map(emp => 
          emp.id === editingEmployee.id ? updatedEmployee : emp
        ));
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        // Create new employee
        const newEmployee = await createEmployee({
          ...data,
          departmentName
        });
        setEmployees([...employees, newEmployee]);
        toast({
          title: "Success",
          description: "Employee created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-company-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-company-blue">Employees</h1>
          <p className="text-muted-foreground mt-1">Manage your company employees</p>
        </div>
        <Button onClick={openNewEmployeeDialog} className="mt-3 sm:mt-0">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search employees..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-sm">Name</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Position</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Department</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Email</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">
                      {employee.firstName} {employee.lastName}
                    </td>
                    <td className="py-3 px-4">{employee.position}</td>
                    <td className="py-3 px-4">{employee.departmentName}</td>
                    <td className="py-3 px-4">{employee.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.status === "ACTIVE"
                            ? "bg-company-success/20 text-company-success"
                            : "bg-company-danger/20 text-company-danger"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditEmployeeDialog(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(employee)}
                        className="text-company-danger hover:text-company-danger/80 hover:bg-company-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                    {searchTerm ? "No employees match your search" : "No employees found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? "Edit Employee" : "Add New Employee"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Position" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hireDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hire Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Salary"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEmployee ? "Save Changes" : "Add Employee"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold">
              {deletingEmployee?.firstName} {deletingEmployee?.lastName}
            </span>
            ? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteEmployee}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
