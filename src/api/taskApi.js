import axios from 'axios'

const api = axios.create({
  baseURL: 'http://12.105.0.1:3010/api/tasks',
})

function authHeader() {
  const token = localStorage.getItem('devtask_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

const unwrapData = (res) => {
  if (res && res.data !== undefined) return res.data
  return res
}

export const fetchTasks = (params) =>
  api.get('/', { params, headers: authHeader() }).then(unwrapData)

export const fetchStats = () =>
  api.get('/stats', { headers: authHeader() }).then(unwrapData)

export const createTask = (data) =>
  api.post('/', data, { headers: authHeader() }).then(unwrapData)

export const updateTaskApi = (id, data) =>
  api.put(`/${id}`, data, { headers: authHeader() }).then(unwrapData)

export const deleteTaskApi = (id) =>
  api.delete(`/${id}`, { headers: authHeader() }).then(unwrapData)

