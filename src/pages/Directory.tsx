
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Users, Search, Building, Phone, Mail } from "lucide-react";
import EmployeeService,{ Employee}  from "@/api/employee.service";

export default function Directory() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log('Employees: Starting to fetch data');
        const empData = await EmployeeService.getAll();
        console.log('Employees: Employees fetched:', empData);
        setEmployees(empData);
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

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
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
          <h1 className="text-2xl font-bold text-company-blue">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">Browse all employees in the company</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, position, department..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <Card key={employee.id} className="p-6 flex flex-col">
              <div className="flex items-start mb-4">
                <Avatar className="h-14 w-14 mr-4">
                  <AvatarFallback className="bg-company-blue/10 text-company-blue">
                    {getInitials(employee.firstName, employee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-muted-foreground">{employee.position}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{employee.departmentName}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`mailto:${employee.email}`} className="text-company-blue hover:underline">
                    {employee.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <a href={`tel:${employee.phone}`} className="text-company-blue hover:underline">
                    {employee.phone}
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-dashed border-muted">
          <Users className="h-12 w-12 text-muted-foreground/60 mb-4" />
          <h3 className="text-lg font-medium mb-2">No employees found</h3>
          <p className="text-muted-foreground text-center">
            {searchTerm 
              ? "No employees match your search criteria. Try a different search term." 
              : "There are no employees in the system."}
          </p>
        </div>
      )}
    </div>
  );
}
