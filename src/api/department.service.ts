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
            const token = localStorage.getItem('token');
            console.log('DepartmentService.getAll: Token present:', !!token);
            
            const response = await api.get<Department[]>('/departments');
            console.log('DepartmentService.getAll: Response received:', response.data);
            console.log('DepartmentService.getAll: Response status:', response.status);
            console.log('DepartmentService.getAll: Response headers:', response.headers);
            return response.data;
        } catch (error: any) {
            console.error('DepartmentService.getAll: Error:', error);
            console.error('DepartmentService.getAll: Error response:', error.response?.data);
            console.error('DepartmentService.getAll: Error status:', error.response?.status);
            throw error;
        }
    },

    getById: async (id: number): Promise<Department> => {
        console.log('DepartmentService.getById: Making API request for id:', id);
        try {
            const token = localStorage.getItem('token');
            console.log('DepartmentService.getById: Token present:', !!token);
            
            const response = await api.get<Department>(`/departments/${id}`);
            console.log('DepartmentService.getById: Response received:', response.data);
            console.log('DepartmentService.getById: Response status:', response.status);
            return response.data;
        } catch (error: any) {
            console.error('DepartmentService.getById: Error:', error);
            console.error('DepartmentService.getById: Error response:', error.response?.data);
            console.error('DepartmentService.getById: Error status:', error.response?.status);
            throw error;
        }
    },

    create: async (data: CreateDepartmentRequest): Promise<Department> => {
        console.log('DepartmentService.create: Making API request with data:', data);
        try {
            const token = localStorage.getItem('token');
            console.log('DepartmentService.create: Token present:', !!token);
            
            const response = await api.post<Department>('/departments', data);
            console.log('DepartmentService.create: Response received:', response.data);
            console.log('DepartmentService.create: Response status:', response.status);
            return response.data;
        } catch (error: any) {
            console.error('DepartmentService.create: Error:', error);
            console.error('DepartmentService.create: Error response:', error.response?.data);
            console.error('DepartmentService.create: Error status:', error.response?.status);
            throw error;
        }
    },

    update: async (id: number, data: UpdateDepartmentRequest): Promise<Department> => {
        console.log('DepartmentService.update: Making API request for id:', id, 'with data:', data);
        try {
            const token = localStorage.getItem('token');
            console.log('DepartmentService.update: Token present:', !!token);
            
            const response = await api.put<Department>(`/departments/${id}`, data);
            console.log('DepartmentService.update: Response received:', response.data);
            console.log('DepartmentService.update: Response status:', response.status);
            return response.data;
        } catch (error: any) {
            console.error('DepartmentService.update: Error:', error);
            console.error('DepartmentService.update: Error response:', error.response?.data);
            console.error('DepartmentService.update: Error status:', error.response?.status);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        console.log('DepartmentService.delete: Making API request for id:', id);
        try {
            const token = localStorage.getItem('token');
            console.log('DepartmentService.delete: Token present:', !!token);
            
            await api.delete(`/departments/${id}`);
            console.log('DepartmentService.delete: Success');
        } catch (error: any) {
            console.error('DepartmentService.delete: Error:', error);
            console.error('DepartmentService.delete: Error response:', error.response?.data);
            console.error('DepartmentService.delete: Error status:', error.response?.status);
            throw error;
        }
    },
};

export default DepartmentService; 