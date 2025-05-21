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
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { DepartmentService, Department, CreateDepartmentRequest } from "@/api/department.service";
import { Building, Plus, Edit, Trash2, Users } from "lucide-react";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  description: z.string().min(1, "Description is required"),
});

type DepartmentFormValues = z.infer<typeof departmentSchema>;

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [deletingDepartment, setDeletingDepartment] = useState<Department | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const deptData = await DepartmentService.getAll();
        setDepartments(deptData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load departments",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const openNewDepartmentDialog = () => {
    form.reset({
      name: "",
      description: "",
    });
    setEditingDepartment(null);
    setIsDialogOpen(true);
  };

  const openEditDepartmentDialog = (department: Department) => {
    form.reset({
      name: department.name,
      description: department.description,
    });
    setEditingDepartment(department);
    setIsDialogOpen(true);
  };

  const confirmDelete = (department: Department) => {
    setDeletingDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDepartment = async () => {
    if (!deletingDepartment) return;
    
    try {
      await DepartmentService.delete(deletingDepartment.id);
      setDepartments(departments.filter(d => d.id !== deletingDepartment.id));
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingDepartment(null);
    }
  };

  const onSubmit = async (data: DepartmentFormValues) => {
    try {
      if (editingDepartment) {
        // Update existing department
        const updatedDepartment = await DepartmentService.update(editingDepartment.id, data);
        setDepartments(departments.map(dept => 
          dept.id === editingDepartment.id ? updatedDepartment : dept
        ));
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        // Create new department
        const newDepartment = await DepartmentService.create(data);
        setDepartments([...departments, newDepartment]);
        toast({
          title: "Success",
          description: "Department created successfully",
        });
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to save department:", error);
      toast({
        title: "Error",
        description: "Failed to save department",
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
          <h1 className="text-2xl font-bold text-company-blue">Departments</h1>
          <p className="text-muted-foreground mt-1">Manage your company departments</p>
        </div>
        <Button onClick={openNewDepartmentDialog} className="mt-3 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Add Department
        </Button>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {departments.length > 0 ? (
          departments.map((department) => (
            <div
              key={department.id}
              className="bg-white rounded-lg shadow overflow-hidden border border-muted"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="bg-company-blue/10 p-2 rounded-full mr-3">
                      <Building className="h-6 w-6 text-company-blue" />
                    </div>
                    <h3 className="text-lg font-semibold">{department.name}</h3>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDepartmentDialog(department)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => confirmDelete(department)}
                      className="text-company-danger hover:text-company-danger/80 hover:bg-company-danger/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {department.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Employees:</span>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{department.employeeCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-muted">
            <Building className="h-12 w-12 text-muted-foreground/60 mb-4" />
            <h3 className="text-lg font-medium mb-2">No Departments</h3>
            <p className="text-muted-foreground text-center mb-4">
              You haven't created any departments yet. Add your first department to get started.
            </p>
            <Button onClick={openNewDepartmentDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Department
            </Button>
          </div>
        )}
      </div>

      {/* Department Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDepartment ? "Edit Department" : "Add New Department"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Department name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Department description" 
                        {...field}
                        className="resize-none" 
                      />
                    </FormControl>
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
                  {editingDepartment ? "Save Changes" : "Add Department"}
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
            Are you sure you want to delete the{" "}
            <span className="font-semibold">{deletingDepartment?.name}</span> department?
            {deletingDepartment && deletingDepartment.employeeCount > 0 && (
              <span className="block text-company-danger mt-2">
                Warning: This department has {deletingDepartment.employeeCount} employees assigned to it.
              </span>
            )}
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
              onClick={handleDeleteDepartment}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
