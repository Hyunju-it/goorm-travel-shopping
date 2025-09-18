import apiClient from './apiClient'

export async function register(payload) {
  const response = await apiClient.post('/auth/register', payload)
  return response.data
}

export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials)
  return response.data
}

export async function logout() {
  await apiClient.post('/auth/logout')
}

export async function fetchCurrentUser() {
  const response = await apiClient.get('/auth/me')
  return response.data
}
