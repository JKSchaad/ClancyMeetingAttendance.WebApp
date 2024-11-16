import { useState } from 'react'
import { Box, Button, Typography } from '@mui/material'
import { QrReader } from 'react-qr-reader'

interface QRScannerProps {
  onScan: (data: string) => void
  onError?: (error: Error) => void
}

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: Error) => {
    console.error('QR Scanner error:', err)
    setError(err.message)
    onError?.(err)
  }

  const handleScan = (data: string | null) => {
    if (data) {
      onScan(data)
    }
  }

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      stream.getTracks().forEach(track => track.stop())
      setHasPermission(true)
      setError(null)
    } catch (err) {
      handleError(err as Error)
    }
  }

  if (!hasPermission) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Camera access is required to scan QR codes
        </Typography>
        <Button
          onClick={requestPermission}
          variant="contained"
          color="primary"
        >
          Grant Camera Access
        </Button>
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          onClick={requestPermission}
          variant="outlined"
          color="primary"
        >
          Try Again
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}>
      <QrReader
        onResult={(result) => {
          if (result) {
            handleScan(result.getText())
          }
        }}
        constraints={{ facingMode: 'environment' }}
        videoStyle={{ width: '100%', height: 'auto' }}
      />
    </Box>
  )
}
