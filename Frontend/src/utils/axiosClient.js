import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://leetcode-clone-s2io.onrender.com/api/v1",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
})

export default axiosClient;