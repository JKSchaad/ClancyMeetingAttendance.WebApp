'use client'

import { useState, useEffect } from 'react'
import { users } from '@/services/api'
import { UserPlus, Edit2, Trash2 } from 'lucide-react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
  createdAt: string
}

interface UserFormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  role: string
}

export const UserList = () => {
  const [userList, setUserList] = useState<User[]>([])
  const [showUserForm, setShowUserForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'user'
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await users.getAllUsers()
      setUserList(data)
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }

  const handleCreateUser = async () => {
    try {
      console.log('Creating user with data:', formData)
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber'] as const
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address')
        return
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^\+?[\d\s-()]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        alert('Please enter a valid phone number')
        return
      }

      await users.createUser(formData)
      console.log('User created successfully')
      setShowUserForm(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'user'
      })
      await loadUsers()
    } catch (error) {
      console.error('Failed to create user:', error)
      if (error instanceof Error) {
        if (error.message.includes('email already exists')) {
          alert('A user with this email already exists')
        } else {
          alert('Failed to create user: ' + error.message)
        }
      } else {
        alert('Failed to create user. Please try again.')
      }
    }
  }

  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      console.log('Updating user with data:', formData)
      
      // Validate required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phoneNumber'] as const
      const missingFields = requiredFields.filter(field => !formData[field])
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address')
        return
      }

      // Validate phone number format (basic validation)
      const phoneRegex = /^\+?[\d\s-()]{10,}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        alert('Please enter a valid phone number')
        return
      }

      await users.updateUser(selectedUser.id, formData)
      console.log('User updated successfully')
      setShowUserForm(false)
      setSelectedUser(null)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        role: 'user'
      })
      await loadUsers()
    } catch (error) {
      console.error('Failed to update user:', error)
      if (error instanceof Error) {
        if (error.message.includes('email already exists')) {
          alert('A user with this email already exists')
        } else {
          alert('Failed to update user: ' + error.message)
        }
      } else {
        alert('Failed to update user. Please try again.')
      }
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await users.deleteUser(userId)
      loadUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const openEditForm = (user: User) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role
    })
    setShowUserForm(true)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Users</h3>
        <button
          onClick={() => {
            setSelectedUser(null)
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              role: 'user'
            })
            setShowUserForm(true)
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>
      <div className="border-t border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userList.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{`${user.firstName} ${user.lastName}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditForm(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog 
        open={showUserForm} 
        onClose={() => setShowUserForm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              console.log('Form submitted')
              try {
                if (selectedUser) {
                  await handleUpdateUser()
                } else {
                  await handleCreateUser()
                }
              } catch (error) {
                console.error('Failed to save user:', error)
                alert('Failed to save user. Please try again.')
              }
            }}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <TextField
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              id="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="outlined"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              required
            />
            <FormControl fullWidth variant="outlined" margin="dense">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                label="Role"
                required
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <DialogActions className="mt-6">
              <Button onClick={() => setShowUserForm(false)} color="inherit">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedUser ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
