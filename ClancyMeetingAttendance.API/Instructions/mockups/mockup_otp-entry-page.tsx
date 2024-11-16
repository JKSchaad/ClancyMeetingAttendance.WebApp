'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface OtpEntryPageProps {
  phoneNumber: string
  onVerify: (otp: string) => Promise<void>
  onResend: () => Promise<void>
}

export default function OtpEntryPage({ phoneNumber, onVerify, onResend }: OtpEntryPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendTimer, setResendTimer] = useState(30)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

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
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
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
      // Successful verification handled by parent component
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Enter One Time Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to {phoneNumber}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            ))}
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5 text-white" />
              ) : (
                <>
                  Verify OTP
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
        <div className="text-center">
          <button
            onClick={handleResend}
            className={`text-sm ${
              resendTimer === 0 ? 'text-indigo-600 hover:text-indigo-500' : 'text-gray-400'
            }`}
            disabled={resendTimer > 0 || isLoading}
          >
            {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
          </button>
        </div>
        {error && (
          <div className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}