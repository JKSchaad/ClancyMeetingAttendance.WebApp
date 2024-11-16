'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Paper, Typography, CircularProgress } from '@mui/material'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (token && userRole === 'admin') {
      router.replace('/admin/dashboard')
    } else if (token) {
      router.replace('/meetings')
    } else {
      router.replace('/login')
    }
  }, [router])

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Clancy Meeting Attendance
        </Typography>
        <CircularProgress sx={{ mt: 4 }} />
      </Paper>
    </Container>
  )
}
