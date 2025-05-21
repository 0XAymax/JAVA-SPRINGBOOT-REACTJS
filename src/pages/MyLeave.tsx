
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
import { LeaveRequest } from "@/types";
import { getEmployeeLeaveRequests, createLeaveRequest } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Calendar, Plus, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const leaveRequestSchema = z.object({
  type: z.enum(["ANNUAL", "SICK", "PERSONAL", "OTHER"], {
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
  
  const { toast } = useToast();
  
  const form = useForm<LeaveRequestFormValues>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: "ANNUAL",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      reason: "",
    },
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await getEmployeeLeaveRequests(user.id);
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
  }, [user, toast]);

  const onSubmit = async (data: LeaveRequestFormValues) => {
    if (!user) return;
    
    try {
      const newRequest = await createLeaveRequest({
        ...data,
        employeeId: user.id,
        employeeName: user.name,
      });
      
      setLeaveRequests([newRequest, ...leaveRequests]);
      
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      
      setIsDialogOpen(false);
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
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
    return diffDays;
  };

  const getStatusColor = (status: LeaveRequest["status"]) => {
    switch (status) {
      case "APPROVED":
        return "status-approved";
      case "PENDING":
        return "status-pending";
      case "REJECTED":
        return "status-rejected";
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-company-blue">
          <div className="flex items-center">
            <div className="rounded-full bg-company-blue/10 p-3 mr-4">
              <Calendar className="h-6 w-6 text-company-blue" />
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Annual Leave</div>
              <div className="text-2xl font-bold">15 days</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-company-purple">
          <div className="flex items-center">
            <div className="rounded-full bg-company-purple/10 p-3 mr-4">
              <Calendar className="h-6 w-6 text-company-purple" />
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Sick Leave</div>
              <div className="text-2xl font-bold">10 days</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-company-success">
          <div className="flex items-center">
            <div className="rounded-full bg-company-success/10 p-3 mr-4">
              <Calendar className="h-6 w-6 text-company-success" />
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Used Leave</div>
              <div className="text-2xl font-bold">
                {leaveRequests.filter(req => req.status === "APPROVED").reduce((total, req) => {
                  return total + calculateDays(req.startDate, req.endDate);
                }, 0)} days
              </div>
            </div>
          </div>
        </div>
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
                  <th className="py-3 px-4 text-left font-medium text-sm">Comments</th>
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
                      <span className={cn("status-pill", getStatusColor(request.status))}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {request.comments || "-"}
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

      {/* Leave Request Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Leave</DialogTitle>
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
                        <SelectItem value="ANNUAL">Annual Leave</SelectItem>
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
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
