import api from './config';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
    };
}

const AuthService = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
    },

    getCurrentUser: async (): Promise<AuthResponse['user']> => {
        const response = await api.get<AuthResponse['user']>('/auth/me');
        return response.data;
    },
};

export default AuthService; 