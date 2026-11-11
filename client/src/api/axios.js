import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASEURL
})

// Expired or invalid login: clear it and go back to the login page
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token')
        window.location.href = '/'
    }
    return Promise.reject(error)
})

export default api
