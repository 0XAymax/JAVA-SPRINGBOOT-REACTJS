import api from './config';

export interface Department {
    id: number;
    name: string;
    description: string;
    employeeCount: number;
}

export interface CreateDepartmentRequest {
    name: string;
    description: string;
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest {}

export const DepartmentService = {
    getAll: async (): Promise<Department[]> => {
        console.log('DepartmentService.getAll: Making API request');
        try {
            const response = await api.get<Department[]>('/departments');
            console.log('DepartmentService.getAll: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('DepartmentService.getAll: Error:', error);
            throw error;
        }
    },

    getById: async (id: number): Promise<Department> => {
        console.log('DepartmentService.getById: Making API request for id:', id);
        try {
            const response = await api.get<Department>(`/departments/${id}`);
            console.log('DepartmentService.getById: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('DepartmentService.getById: Error:', error);
            throw error;
        }
    },

    create: async (data: CreateDepartmentRequest): Promise<Department> => {
        console.log('DepartmentService.create: Making API request with data:', data);
        try {
            const response = await api.post<Department>('/departments', data);
            console.log('DepartmentService.create: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('DepartmentService.create: Error:', error);
            throw error;
        }
    },

    update: async (id: number, data: UpdateDepartmentRequest): Promise<Department> => {
        console.log('DepartmentService.update: Making API request for id:', id, 'with data:', data);
        try {
            const response = await api.put<Department>(`/departments/${id}`, data);
            console.log('DepartmentService.update: Response received:', response.data);
            return response.data;
        } catch (error) {
            console.error('DepartmentService.update: Error:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        console.log('DepartmentService.delete: Making API request for id:', id);
        try {
            await api.delete(`/departments/${id}`);
            console.log('DepartmentService.delete: Success');
        } catch (error) {
            console.error('DepartmentService.delete: Error:', error);
            throw error;
        }
    },
};

export default DepartmentService; 