import axios from "axios";

const api = axios.create({
    baseURL: 'htttp://localhost:5000/api/tasks',
})

export const fetchTask = () => api.get('/').then((res) => res.data)
export const fetchStats = () => api.get('/stats').then((res) => res.data)
export const createTask = (task) => api.post('/', task).then((res) => res.data)
export const updateTask = (id, task) => api.put(`/${id}`, task).then((res) => res.data)
export const deleteTask = (id) => api.delete(`/${id}`)