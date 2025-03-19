// src/
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Adjust the backend URL if needed
  withCredentials: true, // Include cookies for session-based authentication
});

export default axiosInstance;
