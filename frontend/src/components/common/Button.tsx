import { Button as MuiButton, CircularProgress } from '@mui/material'
import { useSpring, animated } from '@react-spring/web'
import { LucideIcon } from 'lucide-react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  color?: 'primary' | 'secondary' | 'error'
  startIcon?: LucideIcon
  endIcon?: LucideIcon
  children: React.ReactNode
}

const AnimatedButton = animated(MuiButton)

export default function Button({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'contained',
  color = 'primary',
  startIcon: StartIcon,
  endIcon: EndIcon,
  children,
}: ButtonProps) {
  const springProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 300, friction: 20 },
  })

  return (
    <AnimatedButton
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      variant={variant}
      color={color}
      style={springProps}
      startIcon={StartIcon && !loading && <StartIcon className="h-5 w-5" />}
      endIcon={EndIcon && !loading && <EndIcon className="h-5 w-5" />}
      sx={{
        height: '48px',
        textTransform: 'none',
        fontWeight: 500,
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        },
      }}
    >
      {loading ? (
        <CircularProgress size={24} color="inherit" />
      ) : (
        children
      )}
    </AnimatedButton>
  )
}
