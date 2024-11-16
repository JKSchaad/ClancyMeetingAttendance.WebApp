import { TextField, InputAdornment } from '@mui/material'
import { LucideIcon } from 'lucide-react'

interface FormInputProps {
  id: string
  name: string
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
  icon?: LucideIcon
  helperText?: string
  error?: boolean
  autoComplete?: string
}

export default function FormInput({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  icon: Icon,
  helperText,
  error = false,
  autoComplete,
}: FormInputProps) {
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      helperText={helperText}
      error={error}
      autoComplete={autoComplete}
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: Icon && (
          <InputAdornment position="start">
            <Icon className="h-5 w-5 text-gray-400" />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: 'primary.main',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'primary.main',
        },
      }}
    />
  )
}
