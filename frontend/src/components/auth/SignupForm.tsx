import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Button, Typography } from '@mui/material'
import { Mail, Phone, User } from 'lucide-react'
import { FormInput } from '../common/FormInput'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // TODO: Implement actual signup API call
      console.log('Form submitted:', formData)
      router.push('/verify')
    } catch (err) {
      setError('Failed to sign up. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isEmailValid = !formData.email || formData.email.endsWith('@clancytheys.com')

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box sx={{ display: 'flex', gap: 2 }}>
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          icon={User}
        />

        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          icon={User}
        />
      </Box>

      <FormInput
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        type="email"
        icon={Mail}
        helperText="Must end with @clancytheys.com"
        error={!isEmailValid}
      />

      <FormInput
        label="Phone Number"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        required
        type="tel"
        icon={Phone}
        helperText="Used for OTP verification"
      />

      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={isLoading || !isEmailValid}
        sx={{
          mt: 2,
          py: 1.5,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        {isLoading ? 'Signing up...' : 'Sign Up'}
      </Button>
    </Box>
  )
}
