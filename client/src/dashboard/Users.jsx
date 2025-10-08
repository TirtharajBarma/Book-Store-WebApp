import React, { useEffect, useState } from 'react'
import { Users as UsersIcon, Mail, Calendar, Shield, Search } from 'lucide-react'

const Users = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Tirtharaj Barma',
      email: 'tirtharaj@example.com',
      role: 'Admin',
      joined: '2024-01-15',
      booksRated: 12,
      avatar: 'TB'
    },
    {
      id: 2,
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'User',
      joined: '2024-02-20',
      booksRated: 5,
      avatar: 'DU'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    active: users.length,
  };

  return (
    <div className="px-4 my-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">User Management</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
            </div>
            <div className="p-4 rounded-full bg-blue-500">
              <UsersIcon size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Admins</p>
              <h3 className="text-3xl font-bold mt-2">{stats.admins}</h3>
            </div>
            <div className="p-4 rounded-full bg-purple-500">
              <Shield size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Active Users</p>
              <h3 className="text-3xl font-bold mt-2">{stats.active}</h3>
            </div>
            <div className="p-4 rounded-full bg-green-500">
              <UsersIcon size={28} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">User</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Email</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Role</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Joined</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Activity</th>
                <th className="text-left py-4 px-6 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' 
                        ? 'bg-purple-100 text-purple-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {new Date(user.joined).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{user.booksRated} books rated</span>
                  </td>
                  <td className="py-4 px-6">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> This is a demo user management interface. In production, you would integrate with your authentication system to show real user data, manage roles, and handle user permissions.
        </p>
      </div>
    </div>
  )
}

export default Users
