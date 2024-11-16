import { 
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material'
import { X } from 'lucide-react'

interface Attendee {
  name: string
  email: string
  signInTime: string
}

interface AttendeeListProps {
  attendees: Attendee[]
  meetingId: string
  onClose: () => void
}

export function AttendeeList({ attendees, meetingId, onClose }: AttendeeListProps) {
  return (
    <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        <span>Meeting Attendees</span>
        <IconButton onClick={onClose} size="small">
          <X className="h-5 w-5" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Sign-in Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendees.map((attendee, index) => (
                <TableRow key={index}>
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.signInTime}</TableCell>
                </TableRow>
              ))}
              {attendees.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No attendees yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}
