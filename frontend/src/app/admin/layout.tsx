'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, CircularProgress, Container } from '@mui/material'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      // Check if user is authenticated and is an admin
      const token = localStorage.getItem('token')
      const userRole = localStorage.getItem('userRole')

      if (!token || userRole !== 'admin') {
        console.log('Not authenticated or not admin, redirecting to login')
        router.replace('/login')
        return
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Add admin navigation/header here if needed */}
      {children}
    </Box>
  )
}
