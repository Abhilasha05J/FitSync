import axios from 'axios';

// Create an Axios instance with a predefined base URL
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});
// Export the instance for use in the app
export default axiosInstance;
