import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/tasks',
})

export const fetchTasks = () => api.get('/').then((res) => res.data)
export const fetchStats = () => api.get('/stats').then((res) => res.data)
export const fetchTaskById = (id) => api.get(`/${id}`).then((res) => res.data)
export const createTask = (data) => api.post('/', data).then((res) => res.data)
export const updateTaskApi = (id, data) => api.put(`/${id}`, data).then((res) => res.data)
export const deleteTaskApi = (id) => api.delete(`/${id}`)