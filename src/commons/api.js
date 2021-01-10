import axios from "axios";
import { getToken } from "../auth/authService";

const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
});

instance.interceptors.request.use(function (config) {
  let accessToken = getToken();
  // console.log(accessToken);
  if (accessToken && accessToken !== "") {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default instance;
