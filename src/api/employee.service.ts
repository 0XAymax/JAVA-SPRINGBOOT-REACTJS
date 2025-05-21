import api from './config';

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId: number;
    departmentName: string;
    position: string;
    hireDate: string;
    salary: number;
    address: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    departmentId: number;
    departmentName: string;
    position: string;
    hireDate: string;
    salary: number;
    address: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}

const EmployeeService = {
    getAll: async (): Promise<Employee[]> => {
        const response = await api.get<Employee[]>('/employees');
        return response.data;
    },

    getById: async (id: number): Promise<Employee> => {
        const response = await api.get<Employee>(`/employees/${id}`);
        return response.data;
    },

    create: async (data: CreateEmployeeRequest): Promise<Employee> => {
        const response = await api.post<Employee>('/employees', data);
        return response.data;
    },

    update: async (id: number, data: UpdateEmployeeRequest): Promise<Employee> => {
        const response = await api.put<Employee>(`/employees/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/employees/${id}`);
    },
};

export default EmployeeService; 