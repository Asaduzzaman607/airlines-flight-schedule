import axios from "axios";

// import config
import { BASE_URL } from "../../config";

const axiosInstance = axios.create({
    // Base URL for API
    baseURL: `${BASE_URL}`
    
});

export default axiosInstance;
