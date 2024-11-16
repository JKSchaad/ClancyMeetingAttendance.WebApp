import { useState } from 'react'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Grid
} from '@mui/material'
import { X } from 'lucide-react'

interface Meeting {
  title: string
  date: string
  time: string
  location: string
}

interface CreateMeetingFormProps {
  onSubmit: (meeting: Meeting) => void
  onClose: () => void
}

export function CreateMeetingForm({ onSubmit, onClose }: CreateMeetingFormProps) {
  const [formData, setFormData] = useState<Meeting>({
    title: '',
    date: '',
    time: '',
    location: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span>Create New Meeting</span>
        <IconButton onClick={onClose} size="small">
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Meeting Title"
                value={formData.title}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="date"
                label="Date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="time"
                label="Time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                value={formData.location}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
            disabled={!formData.title || !formData.date || !formData.time || !formData.location}
          >
            Create Meeting
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
