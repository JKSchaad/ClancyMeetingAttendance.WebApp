import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor for JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    // Handle network errors
    if (!error.response) {
      console.error('Network Error - Unable to reach the server:', error.message)
      return Promise.reject({
        response: {
          data: {
            message: 'Unable to reach the server. Please check your connection and try again.',
          },
        },
      })
    }

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await api.post('/auth/refresh', { refreshToken })
        const { token } = response.data

        // Update tokens
        localStorage.setItem('token', token)
        Cookies.set('token', token, { expires: 7 })

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${token}`
        return axios(originalRequest)
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear tokens and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userRole')
        Cookies.remove('token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: async (email: string, password: string) => {
    try {
      console.log('API Service - Attempting login:', { email, apiUrl: process.env.NEXT_PUBLIC_API_URL })
      const response = await api.post('/auth/login', { email, password })
      console.log('API Service - Login response:', response.data)
      return response.data
    } catch (error) {
      console.error('API Service - Login error:', error)
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Unable to reach the server. Please check if the backend is running at ' + process.env.NEXT_PUBLIC_API_URL)
        }
        throw error
      }
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userRole')
    Cookies.remove('token')
    window.location.href = '/login'
  },

  register: async (data: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
  }) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  verifyOtp: async (phoneNumber: string, otp: string) => {
    const response = await api.post('/auth/verify-otp', { phoneNumber, otp })
    return response.data
  },

  requestOtp: async (phoneNumber: string) => {
    const response = await api.post('/auth/request-otp', { phoneNumber })
    return response.data
  }
}

// Meeting endpoints
export const meetings = {
  signIn: async (meetingId: string, phoneNumber: string) => {
    const response = await api.post(`/meetings/${meetingId}/sign-in`, { phoneNumber })
    return response.data
  },

  getMeeting: async (meetingId: string) => {
    const response = await api.get(`/meetings/${meetingId}`)
    return response.data
  },

  getAttendees: async (meetingId: string) => {
    const response = await api.get(`/meetings/${meetingId}/attendees`)
    return response.data
  },

  // Admin endpoints
  getAllMeetings: async () => {
    const response = await api.get('/meetings')
    return response.data
  },

  createMeeting: async (data: {
    title: string
    date: string
    time: string
    location: string
  }) => {
    try {
      console.log('API Service - Creating meeting:', data)
      const response = await api.post('/meetings', data)
      console.log('API Service - Meeting created:', response.data)
      return response.data
    } catch (error) {
      console.error('API Service - Create meeting error:', error)
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error('Unable to reach the server. Please check if the backend is running.')
        }
        throw error
      }
      throw error
    }
  },

  updateMeetingStatus: async (meetingId: string, status: 'upcoming' | 'ongoing' | 'completed') => {
    const response = await api.patch(`/admin/meetings/${meetingId}/status`, { status })
    return response.data
  },

  downloadAttendance: async (meetingId: string) => {
    const response = await api.get(`/admin/meetings/${meetingId}/attendance/download`, {
      responseType: 'blob'
    })
    return response.data
  },

  generateQRCode: async (meetingId: string) => {
    const response = await api.get(`/meetings/${meetingId}/qr-code`)
    console.log('QR Code API Response:', response)
    return response.data
  }
}

// User endpoints
export const users = {
  getProfile: async () => {
    const response = await api.get('/Users/profile')
    return response.data
  },

  updateProfile: async (data: {
    firstName?: string
    lastName?: string
    phoneNumber?: string
  }) => {
    const response = await api.put('/Users/profile', data)
    return response.data
  },

  getAllUsers: async () => {
    const response = await api.get('/Users')
    return response.data
  },

  getUser: async (id: string) => {
    const response = await api.get(`/Users/${id}`)
    return response.data
  },

  createUser: async (data: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    role?: string
  }) => {
    try {
      console.log('API: Creating user with data:', data)
      const response = await api.post('/Users', data)
      console.log('API: User created successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Failed to create user:', error)
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message)
      }
      throw error
    }
  },

  updateUser: async (id: string, data: {
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber?: string
    role?: string
  }) => {
    try {
      console.log('API: Updating user with data:', data)
      const response = await api.put(`/Users/${id}`, data)
      console.log('API: User updated successfully:', response.data)
      return response.data
    } catch (error) {
      console.error('API: Failed to update user:', error)
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message)
      }
      throw error
    }
  },

  deleteUser: async (id: string) => {
    try {
      console.log('API: Deleting user:', id)
      const response = await api.delete(`/Users/${id}`)
      console.log('API: User deleted successfully')
      return response.data
    } catch (error) {
      console.error('API: Failed to delete user:', error)
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.message || error.message)
      }
      throw error
    }
  }
}

export default api
