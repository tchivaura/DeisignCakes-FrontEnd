import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:7151', // Change this once when you migrate
});

export default axiosInstance;
