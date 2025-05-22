import api from './config';

export interface LeaveRequest {
    id: number;
    employeeId: number;
    startDate: string;
    endDate: string;
    type: 'VACATION' | 'SICK' | 'PERSONAL' | 'OTHER';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    reason: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLeaveRequest {
    startDate: string;
    endDate: string;
    type: 'VACATION' | 'SICK' | 'PERSONAL' | 'OTHER';
    reason: string;
}

export interface UpdateLeaveRequest {
    type?: 'VACATION' | 'SICK' | 'PERSONAL' | 'OTHER';
    startDate?: string;
    endDate?: string;
    reason?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    comment?: string;
}

const LeaveService = {
    getAll: async (): Promise<LeaveRequest[]> => {
        const response = await api.get<LeaveRequest[]>('/leave-requests');
        return response.data;
    },

    getMyRequests: async (): Promise<LeaveRequest[]> => {
        const response = await api.get<LeaveRequest[]>('/leave-requests/my');
        return response.data;
    },

    getById: async (id: number): Promise<LeaveRequest> => {
        const response = await api.get<LeaveRequest>(`/leave-requests/${id}`);
        return response.data;
    },

    create: async (data: CreateLeaveRequest): Promise<LeaveRequest> => {
        const response = await api.post<LeaveRequest>('/leave-requests', data);
        return response.data;
    },

    update: async (id: number, data: UpdateLeaveRequest): Promise<LeaveRequest> => {
        const response = await api.put<LeaveRequest>(`/leave-requests/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/leave-requests/${id}`);
    },
};

export default LeaveService; 