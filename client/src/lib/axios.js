import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('Response error:', error);

        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // Unauthorized - token expired or invalid
                    localStorage.removeItem('token');
                    if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/') {
                        toast({
                            title: 'Session Expired',
                            description: 'Please login again to continue.',
                            variant: 'destructive',
                        });
                        window.location.href = '/sign-in';
                    }
                    break;

                case 403:
                    toast({
                        title: 'Access Denied',
                        description: data?.message || 'You do not have permission to perform this action.',
                        variant: 'destructive',
                    });
                    break;

                case 404:
                    toast({
                        title: 'Not Found',
                        description: data?.message || 'The requested resource was not found.',
                        variant: 'destructive',
                    });
                    break;

                case 500:
                    toast({
                        title: 'Server Error',
                        description: data?.message || 'An internal server error occurred. Please try again later.',
                        variant: 'destructive',
                    });
                    break;

                default:
                    toast({
                        title: 'Error',
                        description: data?.message || 'An unexpected error occurred.',
                        variant: 'destructive',
                    });
            }
        } else if (error.request) {
            // Request was made but no response received
            toast({
                title: 'Network Error',
                description: 'Unable to connect to the server. Please check your internet connection.',
                variant: 'destructive',
            });
        } else {
            // Something else happened
            toast({
                title: 'Error',
                description: error.message || 'An unexpected error occurred.',
                variant: 'destructive',
            });
        }

        return Promise.reject(error);
    }
);

export default api;
