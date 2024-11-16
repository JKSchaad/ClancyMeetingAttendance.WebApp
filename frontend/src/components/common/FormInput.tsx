import { TextField, InputAdornment } from '@mui/material'
import { LucideIcon } from 'lucide-react'

interface FormInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  icon?: LucideIcon
  helperText?: string
  error?: boolean
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
  icon: IconComponent,
  helperText,
  error,
}: FormInputProps) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      type={type}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: IconComponent && (
          <InputAdornment position="start">
            <IconComponent size={20} />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 1,
        },
      }}
    />
  )
}
