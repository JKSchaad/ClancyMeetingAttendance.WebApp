'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  AlertTitle,
} from '@mui/material'
import { auth } from '@/services/api'
import Cookies from 'js-cookie'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (token && userRole === 'admin') {
      router.replace('/admin/dashboard')
    } else if (token) {
      router.replace('/meetings')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Login Page - Submitting form:', { email: formData.email, apiUrl: process.env.NEXT_PUBLIC_API_URL })
      const { token, role } = await auth.login(formData.email, formData.password)
      console.log('Login Page - Login successful:', { role })

      if (token) {
        // Store the token in both localStorage and cookies
        localStorage.setItem('token', token)
        Cookies.set('token', token, { expires: 7 }) // Expires in 7 days

        // Store user role
        localStorage.setItem('userRole', role)
        console.log('Login Page - Stored tokens and role, redirecting to:', role === 'admin' ? '/admin/dashboard' : '/meetings')

        // Redirect based on user role
        if (role === 'admin') {
          router.replace('/admin/dashboard')
        } else {
          router.replace('/meetings')
        }
      }
    } catch (err: any) {
      console.error('Login Page - Login error:', err)
      
      // Handle different types of errors
      if (err.message?.includes('Unable to reach the server')) {
        setError('Unable to connect to the server. Please check if the backend is running and try again.')
      } else if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 404) {
        setError('The login service is not available. Please check the API endpoint configuration.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Clancy Meeting Attendance
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            error={!!error}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            error={!!error}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}
