import { useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Paper, Typography, Box, Chip, Divider } from '@mui/material'
import Button from '../common/Button'
import FormInput from '../forms/FormInput'

interface MeetingDetails {
  id: string
  title: string
  description: string
  location: string
  startTime: string
  endTime: string
  attendeeCount: number
}

interface MeetingSignInProps {
  meeting: MeetingDetails
  onSignIn: (phoneNumber: string) => Promise<void>
}

export default function MeetingSignIn({ meeting, onSignIn }: MeetingSignInProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await onSignIn(phoneNumber)
    } catch (err) {
      setError('Failed to sign in. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <animated.div style={formAnimation} className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Paper elevation={3} className="max-w-md w-full p-8 space-y-8">
        <div className="text-center">
          <Typography variant="h4" component="h1" gutterBottom>
            {meeting.title}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {meeting.description}
          </Typography>
        </div>

        <Box className="space-y-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <Typography variant="body1">{meeting.location}</Typography>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Typography variant="body1">
              {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
            </Typography>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-gray-400" />
            <Typography variant="body1">
              {meeting.attendeeCount} attendees
            </Typography>
          </div>
        </Box>

        <Divider />

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            id="phone-number"
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            placeholder="Enter your phone number"
            helperText="We'll send you an OTP to verify"
          />

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            color="primary"
          >
            Sign In to Meeting
          </Button>

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
        </form>

        <Box className="flex justify-center space-x-2">
          <Chip
            label="QR Code Scanned"
            color="success"
            variant="outlined"
            size="small"
          />
          <Chip
            label="Phone Verification Required"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>
      </Paper>
    </animated.div>
  )
}
