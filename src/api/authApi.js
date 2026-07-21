import axios from "axios";

const api = axios.create({
    baseURL: 'https://devtask-be-production.up.railway.app/api/auth',
})

export const loginApi = (email, password) => api.post('/login', {
    email,
    password
}).then((res) => res.data)

export const getMeApi = (token) => api.get('/me', {
    headers: { Authorization: `Bearer ${token}` }
}).then((res) => res.data)