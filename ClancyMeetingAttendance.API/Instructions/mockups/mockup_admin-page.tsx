'use client'

import { useState } from 'react'
import { Plus, Download, ChevronDown, ChevronUp, Calendar, Clock, MapPin, Users } from 'lucide-react'

interface Meeting {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
}

interface Attendee {
  name: string
  email: string
  signInTime: string
}

export default function AdminPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([
    { id: '1', title: 'Team Sync', date: '2023-05-20', time: '10:00 AM', location: 'Conference Room A', attendees: 12 },
    { id: '2', title: 'Project Review', date: '2023-05-22', time: '2:00 PM', location: 'Conference Room B', attendees: 8 },
    { id: '3', title: 'Client Meeting', date: '2023-05-25', time: '11:00 AM', location: 'Zoom', attendees: 5 },
  ])
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null)
  const [showNewMeetingForm, setShowNewMeetingForm] = useState(false)
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', time: '', location: '' })

  const [attendees, setAttendees] = useState<Attendee[]>([
    { name: 'John Doe', email: 'john@example.com', signInTime: '10:05 AM' },
    { name: 'Jane Smith', email: 'jane@example.com', signInTime: '9:58 AM' },
    { name: 'Bob Johnson', email: 'bob@example.com', signInTime: '10:02 AM' },
  ])

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault()
    const id = (meetings.length + 1).toString()
    setMeetings([...meetings, { ...newMeeting, id, attendees: 0 }])
    setNewMeeting({ title: '', date: '', time: '', location: '' })
    setShowNewMeetingForm(false)
  }

  const handleDownloadAttendance = (meetingId: string) => {
    // In a real application, this would generate and download a CSV file
    console.log(`Downloading attendance for meeting ${meetingId}`)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Meeting Admin</h1>
        
        <div className="mb-8">
          <button
            onClick={() => setShowNewMeetingForm(!showNewMeetingForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="inline-block mr-2 h-5 w-5" />
            Create New Meeting
          </button>
        </div>

        {showNewMeetingForm && (
          <form onSubmit={handleCreateMeeting} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-4">Create New Meeting</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newMeeting.date}
                  onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  id="time"
                  value={newMeeting.time}
                  onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  id="location"
                  value={newMeeting.location}
                  onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Meeting
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {meetings.map((meeting) => (
                <tr key={meeting.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{meeting.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{meeting.attendees}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setExpandedMeeting(expandedMeeting === meeting.id ? null : meeting.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      {expandedMeeting === meeting.id ? (
                        <ChevronUp className="inline-block h-5 w-5" />
                      ) : (
                        <ChevronDown className="inline-block h-5 w-5" />
                      )}
                      {expandedMeeting === meeting.id ? 'Hide' : 'View'} Attendees
                    </button>
                    <button
                      onClick={() => handleDownloadAttendance(meeting.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Download className="inline-block h-5 w-5" />
                      Download
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {expandedMeeting && (
          <div className="mt-4 bg-white rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-semibold p-4 bg-gray-50">Attendees</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sign-in Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendees.map((attendee, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.signInTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}