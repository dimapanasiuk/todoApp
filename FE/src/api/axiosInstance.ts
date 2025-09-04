import axios, { type AxiosError, type AxiosRequestHeaders } from 'axios';
const apiUrl = import.meta.env.VITE_API_URL

export const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      } as AxiosRequestHeaders;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// update token and handle error
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const errorStatus = error.response?.status;

    if (errorStatus === 401 && originalRequest) {

      try {
        
        const response = await axiosInstance.post(`${apiUrl}/auth/token`);
        const newAccessToken = response.data.accessToken;

        localStorage.setItem('accessToken', newAccessToken);
        
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        } as AxiosRequestHeaders;
        
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        
        localStorage.removeItem('accessToken');
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;