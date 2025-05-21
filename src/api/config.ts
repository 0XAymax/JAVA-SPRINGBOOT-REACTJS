import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for authentication
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request Interceptor: Token present:', !!token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('API Request Interceptor: Added Authorization header');
        }
        console.log('API Request Interceptor: Request config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
        });
        return config;
    },
    (error) => {
        console.error('API Request Interceptor: Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response Interceptor: Response received:', {
            url: response.config.url,
            status: response.status,
        });
        return response;
    },
    (error) => {
        console.error('API Response Interceptor: Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message,
            response: error.response?.data,
        });
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api; 