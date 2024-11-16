import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MeetingDetails {
  title: string
  date: string
  time: string
  location: string
}

export default function MeetingSigninConfirmation() {
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the meeting details from your API
    // This is a mock-up of that process
    const fetchMeetingDetails = async () => {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMeetingDetails({
        title: "Weekly Team Sync",
        date: "May 20, 2023",
        time: "10:00 AM",
        location: "Conference Room A"
      })
    }

    fetchMeetingDetails()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Successfully Signed In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            You have been signed into the meeting
          </p>
        </div>

        {meetingDetails && (
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Meeting Details
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Calendar className="h-5 w-5 mr-2" aria-hidden="true" />
                    Date
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {meetingDetails.date}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <Clock className="h-5 w-5 mr-2" aria-hidden="true" />
                    Time
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {meetingDetails.time}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" aria-hidden="true" />
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {meetingDetails.location}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        <div className="mt-8">
          <button
            type="button"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => {/* Handle navigation or closing the app */}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}