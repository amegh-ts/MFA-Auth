import axios, { type AxiosInstance, type AxiosError } from "axios"

export const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
  })

  // Request interceptor
  client.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  )

  // Response interceptor for token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config

      if (error.response?.status === 401 && originalRequest) {
        try {
          await axios.post("/api/auth/refresh", {}, { withCredentials: true })
          // Retry original request
          return client(originalRequest)
        } catch (refreshError) {
          // Redirect to login
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )

  return client
}

export const apiClient = createApiClient()
