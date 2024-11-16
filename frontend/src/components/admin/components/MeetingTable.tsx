import React from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  CircularProgress
} from '@mui/material'
import { Download, QrCode, ChevronDown, ChevronUp } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface MeetingTableProps {
  meetings: Meeting[]
  onDownloadAttendance: (meetingId: string) => void
  onShowQRCode: (meetingId: string) => void
  expandedMeeting: string | null
  setExpandedMeeting: (meetingId: string | null) => void
  isLoading: boolean
}

export function MeetingTable({ 
  meetings, 
  onDownloadAttendance, 
  onShowQRCode,
  expandedMeeting,
  setExpandedMeeting,
  isLoading
}: MeetingTableProps) {
  if (isLoading) {
    return (
      <Box className="flex justify-center items-center py-8">
        <CircularProgress />
      </Box>
    )
  }

  if (meetings.length === 0) {
    return (
      <Box className="text-center py-8">
        <Typography variant="body1" color="text.secondary">
          No meetings found
        </Typography>
      </Box>
    )
  }

  return (
    <TableContainer component={Paper} className="mb-8">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Attendees</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {meetings.map((meeting) => (
            <React.Fragment key={meeting.id}>
              <TableRow>
                <TableCell>{meeting.title}</TableCell>
                <TableCell>{meeting.date}</TableCell>
                <TableCell>{meeting.time}</TableCell>
                <TableCell>{meeting.location}</TableCell>
                <TableCell>{meeting.attendees}</TableCell>
                <TableCell>
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${meeting.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : ''}
                    ${meeting.status === 'ongoing' ? 'bg-green-100 text-green-800' : ''}
                    ${meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' : ''}
                  `}>
                    {meeting.status}
                  </span>
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => onDownloadAttendance(meeting.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Download className="h-5 w-5" />
                  </IconButton>
                  <IconButton
                    onClick={() => onShowQRCode(meeting.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <QrCode className="h-5 w-5" />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                  >
                    {expandedMeeting === meeting.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                  <Collapse in={expandedMeeting === meeting.id} timeout="auto" unmountOnExit>
                    <Box className="p-4">
                      <Typography variant="h6" gutterBottom>
                        Meeting Details
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {meeting.title}
                      </Typography>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
