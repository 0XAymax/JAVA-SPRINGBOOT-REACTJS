import api from "./config";

export interface Salary {
  id: number;
  employeeId: number;
  employeeName: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netSalary: number;
  month: string; // Format: "YYYY-MM"
  year: number;
  status: "PAID" | "PENDING" | "PROCESSING";
  comments?: string;
}

export interface CreateSalaryRequest {
  employeeId: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  month: string; // Format: "YYYY-MM"
  year: number;
  status: "PAID" | "PENDING" | "PROCESSING";
  comments?: string;
}

export interface UpdateSalaryRequest {
  employeeId: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  month: string; // Format: "YYYY-MM"
  year: number;
  status: "PAID" | "PENDING" | "PROCESSING";
  comments?: string;
}

class SalaryService {
  private readonly BASE_URL = "/salaries";

  async getAll(): Promise<Salary[]> {
    const response = await api.get<Salary[]>(this.BASE_URL);
    return response.data;
  }

  async getById(id: number): Promise<Salary> {
    const response = await api.get<Salary>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async getEmployeeSalaries(employeeId: number): Promise<Salary[]> {
    const response = await api.get<Salary[]>(`${this.BASE_URL}/employee/${employeeId}`);
    return response.data;
  }

  async create(data: CreateSalaryRequest): Promise<Salary> {
    const response = await api.post<Salary>(this.BASE_URL, data);
    return response.data;
  }

  async update(id: number, data: UpdateSalaryRequest): Promise<Salary> {
    const response = await api.put<Salary>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`${this.BASE_URL}/${id}`);
  }

  async getByMonthAndYear(month: number, year: number): Promise<Salary[]> {
    const response = await api.get<Salary[]>(`${this.BASE_URL}/month/${month}/year/${year}`);
    return response.data;
  }
}

export default new SalaryService(); 