import { Box, Grid, Card, CardContent, Typography } from '@mui/material'
import { Users, Calendar } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface AnalyticsProps {
  meetings: Meeting[]
}

export function Analytics({ meetings }: AnalyticsProps) {
  const totalAttendees = meetings.reduce((sum, meeting) => sum + meeting.attendees, 0)
  const upcomingMeetings = meetings.filter(m => m.status === 'upcoming').length
  const ongoingMeetings = meetings.filter(m => m.status === 'ongoing').length

  return (
    <Box className="mb-8">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div>
                <Typography variant="h6">Total Meetings</Typography>
                <Typography variant="h4">{meetings.length}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Users className="h-8 w-8 text-emerald-600" />
              <div>
                <Typography variant="h6">Total Attendees</Typography>
                <Typography variant="h4">{totalAttendees}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-amber-600" />
              <div>
                <Typography variant="h6">Active Meetings</Typography>
                <Typography variant="h4">{upcomingMeetings + ongoingMeetings}</Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
