import { useState, useEffect } from 'react'
import { useSpring, animated } from '@react-spring/web'
import { 
  Users, 
  Calendar, 
  Download, 
  Plus,
  QrCode,
  Search
} from 'lucide-react'
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
} from '@mui/material'
import Button from '../common/Button'
import { meetings as meetingsApi } from '../../services/api'

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  attendeeCount: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

export default function MeetingDashboard() {
  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const dashboardAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 280, friction: 20 },
  })

  const handleExportAttendance = async (meetingId: string) => {
    try {
      const data = await meetingsApi.getAttendees(meetingId)
      // Convert to CSV and download
      const csv = convertToCSV(data)
      downloadCSV(csv, `meeting-${meetingId}-attendance.csv`)
    } catch (error) {
      console.error('Failed to export attendance:', error)
    }
  }

  const handleShowQRCode = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    // Show QR code dialog
  }

  const convertToCSV = (data: any[]) => {
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [headers, ...rows].join('\n')
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
  }

  return (
    <animated.div style={dashboardAnimation} className="p-8">
      <Box className="mb-8 flex justify-between items-center">
        <Typography variant="h4" component="h1">
          Meeting Dashboard
        </Typography>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          startIcon={Plus}
          color="primary"
        >
          Create Meeting
        </Button>
      </Box>

      <Paper elevation={0} className="mb-8 p-4">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-primary" />
                <div>
                  <Typography variant="h6">Total Meetings</Typography>
                  <Typography variant="h4">{meetingList.length}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className="flex items-center space-x-4">
                <Users className="h-8 w-8 text-secondary" />
                <div>
                  <Typography variant="h6">Total Attendees</Typography>
                  <Typography variant="h4">
                    {meetingList.reduce((sum, m) => sum + m.attendeeCount, 0)}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent className="flex items-center space-x-4">
                <Calendar className="h-8 w-8 text-accent" />
                <div>
                  <Typography variant="h6">Upcoming Meetings</Typography>
                  <Typography variant="h4">
                    {meetingList.filter(m => m.status === 'upcoming').length}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1} className="p-6">
        <Box className="mb-6 flex justify-between items-center">
          <Typography variant="h5">Meetings</Typography>
          <TextField
            size="small"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <Search className="h-5 w-5 text-gray-400 mr-2" />,
            }}
          />
        </Box>

        <div className="space-y-4">
          {meetingList
            .filter(meeting => 
              meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              meeting.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(meeting => (
              <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Typography variant="h6">{meeting.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {meeting.date} at {meeting.time} • {meeting.location}
                    </Typography>
                    <Typography variant="body2">
                      {meeting.attendeeCount} attendees
                    </Typography>
                  </div>
                  <div className="flex space-x-2">
                    <IconButton
                      onClick={() => handleShowQRCode(meeting)}
                      color="primary"
                      title="Show QR Code"
                    >
                      <QrCode />
                    </IconButton>
                    <IconButton
                      onClick={() => handleExportAttendance(meeting.id)}
                      color="primary"
                      title="Export Attendance"
                    >
                      <Download />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </Paper>

      {/* Create Meeting Dialog would go here */}
      {/* QR Code Dialog would go here */}
    </animated.div>
  )
}
