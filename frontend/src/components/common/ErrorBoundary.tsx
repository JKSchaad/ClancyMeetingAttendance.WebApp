import React from 'react'
import { Paper, Typography, Button, Box } from '@mui/material'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box className="min-h-screen flex items-center justify-center bg-background p-4">
          <Paper elevation={3} className="max-w-lg w-full p-8 text-center space-y-6">
            <AlertTriangle className="h-16 w-16 mx-auto text-error" />
            <Typography variant="h4" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            {this.state.error && (
              <Paper elevation={0} className="bg-gray-50 p-4 mt-4">
                <Typography variant="body2" color="error" className="font-mono">
                  {this.state.error.message}
                </Typography>
              </Paper>
            )}
            <Button
              onClick={this.handleReset}
              variant="contained"
              color="primary"
              startIcon={<RefreshCw />}
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      )
    }

    return this.props.children
  }
}
