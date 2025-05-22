import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Plus, CalendarCheck, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import LeaveService, { LeaveRequest, CreateLeaveRequest } from "@/api/leave.service";
import { useAuth } from "@/context/AuthContext";

const leaveRequestSchema = z.object({
  type: z.enum(["VACATION", "SICK", "PERSONAL", "OTHER"], {
    required_error: "Please select a leave type",
  }),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(5, "Please provide a reason with at least 5 characters"),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start <= end;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

type LeaveRequestFormValues = z.infer<typeof leaveRequestSchema>;

export default function MyLeave() {
  const { user } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const [deletingRequest, setDeletingRequest] = useState<LeaveRequest | null>(null);
  
  const { toast } = useToast();
  
  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: "VACATION",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      reason: "",
    },
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setIsLoading(true);
        const data = await LeaveService.getMyRequests();
        setLeaveRequests(data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
        toast({
          title: "Error",
          description: "Failed to load leave requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveRequests();
  }, [toast]);

  const openEditDialog = (request: LeaveRequest) => {
    setEditingRequest(request);
    form.reset({
      type: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      reason: request.reason,
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (request: LeaveRequest) => {
    setDeletingRequest(request);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingRequest) return;
    
    try {
      await LeaveService.delete(deletingRequest.id);
      setLeaveRequests(leaveRequests.filter(req => req.id !== deletingRequest.id));
      toast({
        title: "Success",
        description: "Leave request deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete leave request:", error);
      toast({
        title: "Error",
        description: "Failed to delete leave request",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingRequest(null);
    }
  };

  const onSubmit = async (data: LeaveRequestFormValues) => {
    try {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time to start of day

      if (startDate < today) {
        toast({
          title: "Invalid Start Date",
          description: "Start date cannot be in the past",
          variant: "destructive",
        });
        return;
      }

      if (startDate > endDate) {
        toast({
          title: "Invalid Date Range",
          description: "Start date cannot be after end date",
          variant: "destructive",
        });
        return;
      }

      if (editingRequest) {
        const updatedRequest = await LeaveService.update(editingRequest.id, {
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
          status: "PENDING"
        });
        setLeaveRequests(leaveRequests.map(req => 
          req.id === editingRequest.id ? updatedRequest : req
        ));
        toast({
          title: "Success",
          description: "Leave request updated successfully",
        });
      } else {
        const newRequest = await LeaveService.create({
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason
        });
        setLeaveRequests([newRequest, ...leaveRequests]);
        toast({
          title: "Success",
          description: "Leave request submitted successfully",
        });
      }
      setIsDialogOpen(false);
      setEditingRequest(null);
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      toast({
        title: "Error",
        description: "Failed to submit leave request",
        variant: "destructive",
      });
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const getStatusColor = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "APPROVED":
        return "bg-company-success/20 text-company-success";
      case "PENDING":
        return "bg-company-warning/20 text-company-warning";
      case "REJECTED":
        return "bg-company-danger/20 text-company-danger";
      default:
        return "";
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
          <h1 className="text-2xl font-bold text-company-blue">My Leave</h1>
          <p className="text-muted-foreground mt-1">Manage your leave requests</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="mt-3 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" />
          Request Leave
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Leave Requests History</h2>
        </div>
        <div className="overflow-x-auto">
          {leaveRequests.length > 0 ? (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-sm">Type</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Duration</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Days</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Reason</th>
                  <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-muted">
                {leaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">{request.type}</td>
                    <td className="py-3 px-4">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {calculateDays(request.startDate, request.endDate)} days
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">{request.reason}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className={cn("px-2 py-1 rounded-full text-xs", getStatusColor(request.status))}>
                          {request.status}
                        </span>
                        {request.status === "PENDING" && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(request)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => confirmDelete(request)}
                              className="text-company-danger hover:text-company-danger/80 hover:bg-company-danger/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center">
              <CalendarCheck className="mx-auto h-12 w-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-medium">No leave requests</h3>
              <p className="mt-2 text-muted-foreground">
                You haven't submitted any leave requests yet.
              </p>
              <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Request Leave
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this leave request? This action cannot be undone.
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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Request Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRequest ? "Edit Leave Request" : "Request Leave"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="VACATION">Vacation</SelectItem>
                        <SelectItem value="SICK">Sick Leave</SelectItem>
                        <SelectItem value="PERSONAL">Personal Leave</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a reason for your leave request" 
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
                  onClick={() => {
                    setIsDialogOpen(false);
                    setEditingRequest(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRequest ? "Save Changes" : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
