import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5296/api',
    headers: {
        'Accept-Language': 'en-US', // Whispering language preference to Backend
        'Content-Type': 'application/json'
    }
});

// In the future, we will add an "interceptor" here and automatically put the Token in every request.
export default axiosInstance;