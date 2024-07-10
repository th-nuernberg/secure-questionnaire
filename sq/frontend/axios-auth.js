import axios from "axios";

const axiosAuth = axios.create({
  baseURL: "/sq/api",
  withCredentials: false,
});

axiosAuth.defaults.withCredentials = false;

export default axiosAuth;
