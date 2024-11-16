import { useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { CheckCircle, Calendar, MapPin, Clock } from 'lucide-react'
import { Paper, Typography, Box, Divider } from '@mui/material'
import Button from '../common/Button'

interface MeetingSignInConfirmationProps {
  meeting: {
    title: string
    location: string
    date: string
    time: string
  }
  userName: string
  onClose: () => void
}

export default function MeetingSignInConfirmation({
  meeting,
  userName,
  onClose,
}: MeetingSignInConfirmationProps) {
  const containerAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 280, friction: 20 },
  })

  const checkmarkAnimation = useSpring({
    from: { opacity: 0, transform: 'scale(0) rotate(-180deg)' },
    to: { opacity: 1, transform: 'scale(1) rotate(0deg)' },
    delay: 300,
    config: { tension: 200, friction: 10 },
  })

  useEffect(() => {
    // Auto close after 5 seconds
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <animated.div style={containerAnimation} className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Paper elevation={3} className="max-w-md w-full p-8 space-y-8">
        <Box className="flex flex-col items-center space-y-4">
          <animated.div style={checkmarkAnimation}>
            <CheckCircle className="h-16 w-16 text-secondary" />
          </animated.div>
          
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Successfully Signed In!
          </Typography>
          
          <Typography variant="body1" color="textSecondary" align="center">
            Welcome, {userName}
          </Typography>
        </Box>

        <Divider />

        <Box className="space-y-4">
          <Typography variant="h6" gutterBottom>
            Meeting Details
          </Typography>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <Typography variant="body1">{meeting.title}</Typography>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <Typography variant="body1">{meeting.location}</Typography>
            </div>

            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <Typography variant="body1">
                {meeting.date} at {meeting.time}
              </Typography>
            </div>
          </div>
        </Box>

        <Box className="space-y-4">
          <Typography variant="body2" color="textSecondary" align="center">
            This window will close automatically in a few seconds
          </Typography>

          <Button
            onClick={onClose}
            fullWidth
            variant="outlined"
            color="primary"
          >
            Close
          </Button>
        </Box>
      </Paper>
    </animated.div>
  )
}
