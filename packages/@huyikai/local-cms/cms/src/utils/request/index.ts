import axios from 'axios';
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse
} from 'axios';
const service: AxiosInstance = axios.create({
  // baseURL: import.meta.env.VITE_APP_BASE_URL,
  // baseURL: '/api',
  timeout: 30000
});

/* 请求拦截器 */
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/* 响应拦截器 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    console.log('error', error.response.data);
    message.error(error.response.data);
    return Promise.reject(error);
  }
);

export default service;
