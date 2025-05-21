
export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "EMPLOYEE";
  avatar?: string;
};

export type Department = {
  id: string;
  name: string;
  description: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
};

export type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  departmentName: string;
  position: string;
  hireDate: string;
  salary: number;
  address: string;
  status: "ACTIVE" | "INACTIVE";
  avatar?: string;
};

export type LeaveRequest = {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "ANNUAL" | "SICK" | "PERSONAL" | "OTHER";
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  comments: string;
  requestDate: string;
};

export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
};
