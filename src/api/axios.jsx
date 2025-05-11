import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Change this once when you migrate
});

export default axiosInstance;
