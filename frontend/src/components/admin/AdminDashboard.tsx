'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search
} from 'lucide-react'
import { meetings } from '@/services/api'
import { Analytics } from './components/Analytics'
import { CreateMeetingForm } from './components/CreateMeetingForm'
import { MeetingTable } from './components/MeetingTable'
import { AttendeeList } from './components/AttendeeList'

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

interface Attendee {
  name: string
  email: string
  signInTime: string
}

export default function AdminDashboard() {
  const [meetingList, setMeetingList] = useState<Meeting[]>([])
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null)
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch meetings on component mount
  useEffect(() => {
    fetchMeetings()
  }, [])

  // Fetch attendees when a meeting is expanded
  useEffect(() => {
    if (expandedMeeting) {
      fetchAttendees(expandedMeeting)
    }
  }, [expandedMeeting])

  const fetchMeetings = async () => {
    try {
      setIsLoading(true)
      const data = await meetings.getAllMeetings()
      setMeetingList(data)
      setError(null)
    } catch (err) {
      setError('Failed to load meetings. Please try again.')
      console.error('Error fetching meetings:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAttendees = async (meetingId: string) => {
    try {
      const data = await meetings.getAttendees(meetingId)
      setAttendees(data)
    } catch (err) {
      console.error('Error fetching attendees:', err)
    }
  }

  const handleCreateMeeting = async (meeting: Omit<Meeting, 'id' | 'attendees' | 'status'>) => {
    try {
      console.log('Admin Dashboard - Creating meeting:', meeting)
      await meetings.createMeeting(meeting)
      console.log('Admin Dashboard - Meeting created successfully')
      await fetchMeetings() // Refresh the meetings list
      setShowNewMeetingForm(false)
    } catch (err: any) {
      console.error('Admin Dashboard - Error creating meeting:', err)
      if (err.response?.status === 401) {
        setError('You are not authorized to create meetings')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Failed to create meeting. Please try again.')
      }
    }
  }

  const handleDownloadAttendance = async (meetingId: string) => {
    try {
      const blob = await meetings.downloadAttendance(meetingId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `attendance-${meetingId}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Error downloading attendance:', err)
    }
  }

  const handleShowQRCode = async (meetingId: string) => {
    try {
      const qrCodeData = await meetings.generateQRCode(meetingId)
      // TODO: Show QR code in a modal
      console.log('QR Code data:', qrCodeData)
    } catch (err) {
      console.error('Error generating QR code:', err)
    }
  }

  // Filter meetings based on search term
  const filteredMeetings = meetingList.filter(meeting => 
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchMeetings}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Meeting Admin</h1>
          <button
            onClick={() => setShowNewMeetingForm(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Meeting
          </button>
        </div>

        {/* Analytics Section */}
        <Analytics meetings={meetingList} />

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search meetings..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Meetings Table */}
        <MeetingTable 
          meetings={filteredMeetings}
          onDownloadAttendance={handleDownloadAttendance}
          onShowQRCode={handleShowQRCode}
          expandedMeeting={expandedMeeting}
          setExpandedMeeting={setExpandedMeeting}
          isLoading={isLoading}
        />

        {/* Create Meeting Modal */}
        {showNewMeetingForm && (
          <CreateMeetingForm
            onSubmit={handleCreateMeeting}
            onClose={() => setShowNewMeetingForm(false)}
          />
        )}

        {/* Attendee List */}
        {expandedMeeting && (
          <AttendeeList
            attendees={attendees}
            meetingId={expandedMeeting}
            onClose={() => setExpandedMeeting(null)}
          />
        )}
      </div>
    </div>
  )
}
