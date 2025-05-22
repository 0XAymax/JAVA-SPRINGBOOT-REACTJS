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
import { DollarSign, Search, Plus, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SalaryService from "@/api/salary.service";
import type { Salary, CreateSalaryRequest, UpdateSalaryRequest } from "@/api/salary.service";
import { useAuth } from "@/context/AuthContext";
import EmployeeService, { Employee } from "@/api/employee.service";

const salarySchema = z.object({
  employeeId: z.coerce.number().min(1, "Employee is required"),
  baseSalary: z.coerce.number().min(0, "Base salary must be a positive number"),
  bonus: z.coerce.number().min(0, "Bonus must be a positive number"),
  deductions: z.coerce.number().min(0, "Deductions must be a positive number"),
  month: z.string().min(1, "Month is required"),
  year: z.coerce.number().min(2000, "Year must be valid"),
  status: z.enum(["PAID", "PENDING", "PROCESSING"]),
});

type SalaryFormValues = z.infer<typeof salarySchema>;

export default function Salary() {
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Salary | null>(null);
  const [deletingSalary, setDeletingSalary] = useState<Salary | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      employeeId: 0,
      baseSalary: 0,
      bonus: 0,
      deductions: 0,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      status: "PENDING",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [salaryData, employeeData] = await Promise.all([
          user?.role === "ADMIN" ? SalaryService.getAll() : SalaryService.getEmployeeSalaries(parseInt(user?.id || "0", 10)),
          EmployeeService.getAll()
        ]);
        setSalaries(salaryData);
        setEmployees(employeeData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load salary records",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  const filteredSalaries = salaries.filter(salary => {
    const searchLower = searchTerm.toLowerCase();
    return (
      salary.employeeName.toLowerCase().includes(searchLower) ||
      salary.month.toLowerCase().includes(searchLower) ||
      salary.status.toLowerCase().includes(searchLower)
    );
  });

  const openNewSalaryDialog = () => {
    form.reset({
      employeeId: 0,
      baseSalary: 0,
      bonus: 0,
      deductions: 0,
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      status: "PENDING",
    });
    setEditingSalary(null);
    setIsDialogOpen(true);
  };

  const openEditSalaryDialog = (salary: Salary) => {
    // Extract month name from the YearMonth string (e.g., "2024-10" -> "October")
    const [year, month] = salary.month.split('-');
    const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' });

    form.reset({
      employeeId: salary.employeeId,
      baseSalary: salary.baseSalary,
      bonus: salary.bonus,
      deductions: salary.deductions,
      month: monthName,
      year: parseInt(year),
      status: salary.status,
    });
    setEditingSalary(salary);
    setIsDialogOpen(true);
  };

  const confirmDelete = (salary: Salary) => {
    setDeletingSalary(salary);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteSalary = async () => {
    if (!deletingSalary) return;
    
    try {
      await SalaryService.delete(deletingSalary.id);
      setSalaries(salaries.filter(s => s.id !== deletingSalary.id));
      toast({
        title: "Success",
        description: "Salary record deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete salary:", error);
      toast({
        title: "Error",
        description: "Failed to delete salary record",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingSalary(null);
    }
  };

  const onSubmit = async (data: SalaryFormValues) => {
    try {
      // Convert month name to month number (1-12)
      const monthNumber = new Date(`${data.month} 1, 2000`).getMonth() + 1;
      const formattedMonth = `${data.year}-${monthNumber.toString().padStart(2, '0')}`;
      
      // Ensure year is a valid number
      const year = Number(data.year);
      if (isNaN(year)) {
        throw new Error("Invalid year value");
      }
      
      // Create the request data with proper YearMonth format (YYYY-MM)
      const requestData = {
        employeeId: data.employeeId,
        baseSalary: data.baseSalary,
        bonus: data.bonus,
        deductions: data.deductions,
        month: formattedMonth,
        year: year,
        status: data.status,
        comments: null
      };

      console.log('Submitting salary data:', requestData); // Debug log

      if (editingSalary) {
        const updatedSalary = await SalaryService.update(editingSalary.id, requestData as UpdateSalaryRequest);
        setSalaries(salaries.map(s => 
          s.id === editingSalary.id ? updatedSalary : s
        ));
        toast({
          title: "Success",
          description: "Salary record updated successfully",
        });
      } else {
        const newSalary = await SalaryService.create(requestData as CreateSalaryRequest);
        setSalaries([...salaries, newSalary]);
        toast({
          title: "Success",
          description: "Salary record created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save salary:", error);
      toast({
        title: "Error",
        description: "Failed to save salary record",
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
          <h1 className="text-2xl font-bold text-company-blue">Salary Management</h1>
          <p className="text-muted-foreground mt-1">Manage employee salary records</p>
        </div>
        {user?.role === "ADMIN" && (
          <Button onClick={openNewSalaryDialog} className="mt-3 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add Salary Record
          </Button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by employee name, month, or status..."
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
                <th className="py-3 px-4 text-left font-medium text-sm">Employee</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Month</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Base Salary</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Bonus</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Deductions</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Net Salary</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                {user?.role === "ADMIN" && (
                  <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredSalaries.length > 0 ? (
                filteredSalaries.map((salary) => (
                  <tr key={salary.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">{salary.employeeName}</td>
                    <td className="py-3 px-4">{salary.month} {salary.year}</td>
                    <td className="py-3 px-4">${salary.baseSalary.toLocaleString()}</td>
                    <td className="py-3 px-4">${salary.bonus.toLocaleString()}</td>
                    <td className="py-3 px-4">${salary.deductions.toLocaleString()}</td>
                    <td className="py-3 px-4 font-medium">${salary.netSalary.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs",
                        salary.status === "PAID" && "bg-company-success/20 text-company-success",
                        salary.status === "PENDING" && "bg-company-warning/20 text-company-warning",
                        salary.status === "PROCESSING" && "bg-company-blue/20 text-company-blue"
                      )}>
                        {salary.status}
                      </span>
                    </td>
                    {user?.role === "ADMIN" && (
                      <td className="py-3 px-4 text-right space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditSalaryDialog(salary)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => confirmDelete(salary)}
                          className="text-company-danger hover:text-company-danger/80 hover:bg-company-danger/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={user?.role === "ADMIN" ? 8 : 7} className="py-8 text-center text-muted-foreground">
                    <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                    {searchTerm ? "No salary records match your search" : "No salary records found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Salary Form Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingSalary ? "Edit Salary Record" : "Add New Salary Record"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employee</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id.toString()}>
                                {employee.firstName} {employee.lastName}
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
                    name="baseSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Base salary"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bonus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bonus</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Bonus amount"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deductions</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Deductions amount"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Month</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => {
                              const month = new Date(0, i).toLocaleString('default', { month: 'long' });
                              return (
                                <SelectItem key={month} value={month}>
                                  {month}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Year"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                          <SelectItem value="PAID">Paid</SelectItem>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
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
                    {editingSalary ? "Save Changes" : "Add Salary Record"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {user?.role === "ADMIN" && (
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete the salary record for{" "}
              <span className="font-semibold">
                {deletingSalary?.employeeName}
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
                onClick={handleDeleteSalary}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 