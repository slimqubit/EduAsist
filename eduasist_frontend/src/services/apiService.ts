// src/services/apiService.ts
import axios from 'axios';
import { storageService } from './storageService';
//import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';




const apiClient = axios.create({
    //baseURL: 'http://82.78.147.202:8075',
    baseURL: 'http://localhost:5173',
    timeout: 10000,  // Timeout after 10 seconds
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        // Modify the config before the request is sent
        const token = storageService.getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle the error if the request could not be made
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response) => {
        // Handle a successful response
        return response;
    },
    (error) => {
        //const navigate = useNavigate();
        // Handle the response error
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            switch (error.response.status) {
                case 401:
                    // Unauthorized
                    //
                    storageService.removeToken();
                    //window.location.href = '/login';
                    window.location.href = '/login/401';
                    ///navigate('/login', { state: { message: 'Sesiunea a expirat. Este necesar să vă autentificați din nou.' } });
                    console.error('Unauthorized access - maybe redirect to login?', error.response.data.message);
                    break;
                case 403:
                    // Forbidden
                    console.error('Access forbidden - you do not have the correct permissions.', error.response.data.message);
                    break;
                case 404:
                    // Not found
                    console.error('Resource not found.', error.response.data.message);
                    break;
                case 500:
                    // Server error
                    console.error('Internal server error.', error.response.data.message);
                    break;
                default:
                    console.error('An error occurred: ', error.response.data.message);
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received from server.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
        }

        // Optionally, you can return a custom error message
        return Promise.reject(error);
    }
);

export { apiClient };
