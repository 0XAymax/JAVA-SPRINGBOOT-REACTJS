
// Mock API functions that will connect to the Spring Boot backend
// These would be replaced with real API calls when the backend is ready

import { Department, Employee, LeaveRequest, User } from "@/types";

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@company.com",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john@company.com",
    role: "EMPLOYEE",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Jane Doe",
    email: "jane@company.com",
    role: "EMPLOYEE",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=2938&auto=format&fit=crop",
  }
];

const mockDepartments: Department[] = [
  {
    id: "1",
    name: "Engineering",
    description: "Software development and infrastructure",
    managerId: "2",
    managerName: "John Smith",
    employeeCount: 15
  },
  {
    id: "2",
    name: "Marketing",
    description: "Brand management and promotion",
    managerId: "3",
    managerName: "Jane Doe",
    employeeCount: 8
  },
  {
    id: "3",
    name: "Human Resources",
    description: "Employee management and recruiting",
    managerId: "1",
    managerName: "Admin User",
    employeeCount: 5
  }
];

const mockEmployees: Employee[] = [
  {
    id: "2",
    firstName: "John",
    lastName: "Smith",
    email: "john@company.com",
    phone: "555-1234",
    departmentId: "1",
    departmentName: "Engineering",
    position: "Senior Developer",
    hireDate: "2020-03-15",
    salary: 95000,
    address: "123 Tech Lane, San Francisco",
    status: "ACTIVE"
  },
  {
    id: "3",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@company.com",
    phone: "555-5678",
    departmentId: "2",
    departmentName: "Marketing",
    position: "Marketing Director",
    hireDate: "2019-11-01",
    salary: 92000,
    address: "456 Market St, New York",
    status: "ACTIVE"
  },
  {
    id: "4",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@company.com",
    phone: "555-9101",
    departmentId: "1",
    departmentName: "Engineering",
    position: "Software Engineer",
    hireDate: "2021-05-10",
    salary: 85000,
    address: "789 Code Ave, Seattle",
    status: "ACTIVE"
  },
  {
    id: "5",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah@company.com",
    phone: "555-1122",
    departmentId: "3",
    departmentName: "Human Resources",
    position: "HR Specialist",
    hireDate: "2022-01-20",
    salary: 78000,
    address: "321 Staff Road, Chicago",
    status: "ACTIVE"
  },
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: "1",
    employeeId: "2",
    employeeName: "John Smith",
    type: "ANNUAL",
    startDate: "2023-07-01",
    endDate: "2023-07-05",
    reason: "Family vacation",
    status: "APPROVED",
    comments: "Approved by Admin",
    requestDate: "2023-06-15"
  },
  {
    id: "2",
    employeeId: "3",
    employeeName: "Jane Doe",
    type: "SICK",
    startDate: "2023-06-10",
    endDate: "2023-06-12",
    reason: "Not feeling well",
    status: "APPROVED",
    comments: "Get well soon!",
    requestDate: "2023-06-09"
  },
  {
    id: "3",
    employeeId: "4",
    employeeName: "Mike Johnson",
    type: "PERSONAL",
    startDate: "2023-08-15",
    endDate: "2023-08-16",
    reason: "Personal matters",
    status: "PENDING",
    comments: "",
    requestDate: "2023-08-01"
  },
];

// Auth API
export const loginUser = async (email: string, password: string): Promise<User> => {
  // This would be a real API call to authenticate
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(user => user.email === email);
      if (user && password === "password") {
        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

// Employees API
export const getEmployees = async (): Promise<Employee[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockEmployees);
    }, 500);
  });
};

export const getEmployee = async (id: string): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const employee = mockEmployees.find(e => e.id === id);
      if (employee) {
        resolve(employee);
      } else {
        reject(new Error("Employee not found"));
      }
    }, 500);
  });
};

export const createEmployee = async (employee: Omit<Employee, "id">): Promise<Employee> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newEmployee = {
        ...employee,
        id: Math.random().toString(36).substring(2, 9),
      };
      mockEmployees.push(newEmployee as Employee);
      resolve(newEmployee as Employee);
    }, 500);
  });
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees[index] = { ...mockEmployees[index], ...employee };
        resolve(mockEmployees[index]);
      } else {
        reject(new Error("Employee not found"));
      }
    }, 500);
  });
};

export const deleteEmployee = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockEmployees.findIndex(e => e.id === id);
      if (index !== -1) {
        mockEmployees.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Employee not found"));
      }
    }, 500);
  });
};

// Departments API
export const getDepartments = async (): Promise<Department[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDepartments);
    }, 500);
  });
};

export const getDepartment = async (id: string): Promise<Department> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const department = mockDepartments.find(d => d.id === id);
      if (department) {
        resolve(department);
      } else {
        reject(new Error("Department not found"));
      }
    }, 500);
  });
};

export const createDepartment = async (department: Omit<Department, "id">): Promise<Department> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDepartment = {
        ...department,
        id: Math.random().toString(36).substring(2, 9),
      };
      mockDepartments.push(newDepartment as Department);
      resolve(newDepartment as Department);
    }, 500);
  });
};

export const updateDepartment = async (id: string, department: Partial<Department>): Promise<Department> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDepartments.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepartments[index] = { ...mockDepartments[index], ...department };
        resolve(mockDepartments[index]);
      } else {
        reject(new Error("Department not found"));
      }
    }, 500);
  });
};

export const deleteDepartment = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDepartments.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDepartments.splice(index, 1);
        resolve();
      } else {
        reject(new Error("Department not found"));
      }
    }, 500);
  });
};

// Leave Requests API
export const getLeaveRequests = async (): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLeaveRequests);
    }, 500);
  });
};

export const getEmployeeLeaveRequests = async (employeeId: string): Promise<LeaveRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const requests = mockLeaveRequests.filter(req => req.employeeId === employeeId);
      resolve(requests);
    }, 500);
  });
};

export const createLeaveRequest = async (leaveRequest: Omit<LeaveRequest, "id" | "status" | "requestDate">): Promise<LeaveRequest> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRequest = {
        ...leaveRequest,
        id: Math.random().toString(36).substring(2, 9),
        status: "PENDING",
        requestDate: new Date().toISOString().split('T')[0],
        comments: ""
      };
      mockLeaveRequests.push(newRequest as LeaveRequest);
      resolve(newRequest as LeaveRequest);
    }, 500);
  });
};

export const updateLeaveRequestStatus = async (
  id: string, 
  status: LeaveRequest["status"], 
  comments: string
): Promise<LeaveRequest> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockLeaveRequests.findIndex(req => req.id === id);
      if (index !== -1) {
        mockLeaveRequests[index] = { 
          ...mockLeaveRequests[index], 
          status, 
          comments 
        };
        resolve(mockLeaveRequests[index]);
      } else {
        reject(new Error("Leave request not found"));
      }
    }, 500);
  });
};
