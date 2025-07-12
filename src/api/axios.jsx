import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7152', // Change this once when you migrate
});

export default axiosInstance;
