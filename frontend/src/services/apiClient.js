import axios from 'axios'

const DEFAULT_BASE_URL = 'http://localhost:8080/api'
const xsrfHeaderName = 'X-XSRF-TOKEN'
const xsrfCookieName = 'XSRF-TOKEN'

function getBaseUrl() {
  const envUrl = import.meta.env?.VITE_API_BASE_URL
  if (envUrl) {
    return envUrl.endsWith('/') ? `${envUrl.slice(0, -1)}` : envUrl
  }
  return DEFAULT_BASE_URL
}

function readCookie(name) {
  const value = document?.cookie
  if (!value) {
    return null
  }
  const cookies = value.split(';').map((cookie) => cookie.trim())
  const target = cookies.find((cookie) => cookie.startsWith(`${name}=`))
  return target ? decodeURIComponent(target.split('=')[1]) : null
}

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const method = config.method?.toUpperCase() || 'GET'
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = readCookie(xsrfCookieName)
    if (token) {
      config.headers[xsrfHeaderName] = token
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { data } = error.response
      if (data?.message) {
        error.message = data.message
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
