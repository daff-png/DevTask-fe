
import axios from "axios";

const api = axios.create({
    baseURL: 'http://12.105.0.1:3010/api/auth',
})

export const loginApi = (email, password) => api.post('/login', {
    email,
    password
}).then((res) => res.data)

export const getMeApi = (token) => api.get('/me', {
    headers: { Authorization: `Bearer ${token}` }
}).then((res) => res.data)
