import { useState, useEffect } from 'react'
import { Box, CircularProgress, Typography, Alert } from '@mui/material'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <Alert 
      severity="warning" 
      sx={{ 
        position: 'fixed', 
        bottom: 16, 
        left: '50%', 
        transform: 'translateX(-50%)',
        zIndex: 9999,
      }}
    >
      You are currently offline. Some features may be unavailable.
    </Alert>
  )
}
