
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { LeaveRequest } from "@/types";
import { getLeaveRequests, updateLeaveRequestStatus } from "@/lib/api";
import { Calendar, Check, X, Search, Filter, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LeaveRequests() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<"APPROVE" | "REJECT" | null>(null);
  const [comments, setComments] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeaveRequest["status"] | "ALL">("ALL");
  
  const { toast } = useToast();

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setIsLoading(true);
        const data = await getLeaveRequests();
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

  const handleAction = (request: LeaveRequest, action: "APPROVE" | "REJECT") => {
    setCurrentRequest(request);
    setActionType(action);
    setComments("");
    setIsActionDialogOpen(true);
  };

  const handleSubmitAction = async () => {
    if (!currentRequest || !actionType) return;
    
    try {
      const status = actionType === "APPROVE" ? "APPROVED" : "REJECTED";
      const updatedRequest = await updateLeaveRequestStatus(
        currentRequest.id,
        status,
        comments
      );
      
      setLeaveRequests(leaveRequests.map(req => 
        req.id === updatedRequest.id ? updatedRequest : req
      ));
      
      toast({
        title: "Success",
        description: `Leave request ${status.toLowerCase()} successfully`,
      });
      
      setIsActionDialogOpen(false);
    } catch (error) {
      console.error("Failed to update leave request:", error);
      toast({
        title: "Error",
        description: "Failed to update leave request",
        variant: "destructive",
      });
    }
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
          <h1 className="text-2xl font-bold text-company-blue">Leave Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage employee leave requests</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leave requests..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-48">
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>Filter by status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-sm">Employee</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Type</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Duration</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Reason</th>
                <th className="py-3 px-4 text-left font-medium text-sm">Status</th>
                <th className="py-3 px-4 text-right font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30">
                    <td className="py-3 px-4">{request.employeeName}</td>
                    <td className="py-3 px-4">{request.type}</td>
                    <td className="py-3 px-4">
                      {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 max-w-[200px] truncate">{request.reason}</td>
                    <td className="py-3 px-4">
                      <span className={cn("status-pill", getStatusColor(request.status))}>
                        {request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {request.status === "PENDING" ? (
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(request, "APPROVE")}
                            className="text-company-success hover:text-company-success/80 hover:bg-company-success/10"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAction(request, "REJECT")}
                            className="text-company-danger hover:text-company-danger/80 hover:bg-company-danger/10"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {request.comments ? "Has comments" : "No comments"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    <CalendarCheck className="w-12 h-12 mx-auto mb-3 text-muted-foreground/60" />
                    {searchTerm || statusFilter !== "ALL" 
                      ? "No leave requests match your filters" 
                      : "No leave requests found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "APPROVE" ? "Approve Leave Request" : "Reject Leave Request"}
            </DialogTitle>
          </DialogHeader>
          
          {currentRequest && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Employee:</span>
                  <span>{currentRequest.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Leave Type:</span>
                  <span>{currentRequest.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>
                    {new Date(currentRequest.startDate).toLocaleDateString()} - {new Date(currentRequest.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Reason:</span>
                  <span>{currentRequest.reason}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="comments" className="text-sm font-medium">
                  Comments (optional)
                </label>
                <Textarea
                  id="comments"
                  placeholder="Add your comments here..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsActionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  onClick={handleSubmitAction}
                  variant={actionType === "APPROVE" ? "default" : "destructive"}
                >
                  {actionType === "APPROVE" ? "Approve" : "Reject"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
