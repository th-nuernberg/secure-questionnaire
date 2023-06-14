import axios from "axios";
const axiosAuth = axios.create({
  baseURL: "http://172.18.0.2:5000/api",
  withCredentials: false,
});
axiosAuth.defaults.withCredentials = false;
export default axiosAuth;
