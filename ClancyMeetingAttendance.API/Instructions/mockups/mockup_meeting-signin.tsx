'use client'

import { useState } from 'react'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'

export default function MeetingSignin() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement actual phone number verification logic here
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      setStep('otp')
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement actual OTP verification logic here
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulating API call
      // TODO: Handle successful sign-in (e.g., redirect to meeting page)
      console.log('Successfully signed in to meeting')
    } catch (err) {
      setError('Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && !isNaN(Number(value))) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)

      // Move to next input if value is entered
      if (value !== '' && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        if (nextInput) nextInput.focus()
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Meeting
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to receive a One Time Password' 
              : 'Enter the One Time Password sent to your phone'}
          </p>
        </div>
        {step === 'phone' ? (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="phone-number" className="sr-only">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="phone-number"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              </div>
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
                    Send OTP
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
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
        )}
        {error && (
          <div className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}