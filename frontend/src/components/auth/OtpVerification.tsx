import { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { ArrowRight } from 'lucide-react'
import { Paper, Typography, Alert, Box } from '@mui/material'
import Button from '../common/Button'

interface OtpVerificationProps {
  phoneNumber: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
}

export default function OtpVerification({ phoneNumber, onVerify, onResend }: OtpVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && !isNaN(Number(value))) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Move to next input if value is entered
      if (value !== '' && index < 5) {
        const nextInput = document.querySelector(
          `input[name=otp-${index + 1}]`
        ) as HTMLInputElement
        nextInput?.focus()
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setIsLoading(false)
      return
    }

    try {
      await onVerify(otpString)
    } catch (err) {
      setError('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer === 0) {
      setIsLoading(true)
      setError('')
      try {
        await onResend()
        setResendTimer(30)
      } catch (err) {
        setError('Failed to resend OTP. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <animated.div style={formAnimation} className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Paper elevation={3} className="max-w-md w-full p-8 space-y-8">
        <div>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Enter One Time Password
          </Typography>
          <Typography variant="body2" color="textSecondary" align="center">
            We've sent a 6-digit code to {phoneNumber}
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Box className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                name={`otp-${index}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-2xl border-2 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                required
              />
            ))}
          </Box>

          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            endIcon={ArrowRight}
          >
            Verify OTP
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="text"
            onClick={handleResend}
            disabled={resendTimer > 0 || isLoading}
            color="primary"
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </Button>
        </div>

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
      </Paper>
    </animated.div>
  )
}
