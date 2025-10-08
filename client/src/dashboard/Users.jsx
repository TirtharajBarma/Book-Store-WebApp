import React, { useEffect, useState, useContext } from 'react'
import { Users as UsersIcon, Shield, Clock, Search, Mail, Calendar, Crown } from 'lucide-react'
import KBackend from '../utils/constants'
import { AuthContext } from '../context/AuthProvider'
import toast from 'react-hot-toast'

const Users = () => {
  const { user, userRole } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${KBackend.url}/users`);
      const data = await response.json();
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleRoleChange = async (targetUid, newRole) => {
    if (!user?.uid) {
      toast.error('You must be logged in to change roles');
      return;
    }

    if (userRole !== 'admin') {
      toast.error('Only admins can change user roles');
      return;
    }

    const loadingToast = toast.loading(`${newRole === 'admin' ? 'Promoting to admin' : 'Removing admin role'}...`);

    try {
      const response = await fetch(`${KBackend.url}/user/${targetUid}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: newRole,
          adminUid: user.uid
        })
      });

      if (response.ok) {
        toast.success(
          newRole === 'admin' ? '👑 User promoted to admin!' : '✅ Admin role removed!', 
          { id: loadingToast, duration: 3000 }
        );
        fetchUsers(); // Refresh list
      } else {
        const error = await response.json();
        toast.error(`Failed: ${error.error}`, { id: loadingToast });
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Network error. Please check your connection.', { id: loadingToast });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    activeUsers: users.filter(u => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(u.lastLogin) >= sevenDaysAgo;
    }).length
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="px-4 my-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-8 mt-16 lg:mt-0">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">User Management</h2>
        <p className="text-gray-500">Manage users and permissions</p>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-8">
        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <UsersIcon size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.totalUsers}
            </h3>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Shield size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Admins</p>
            <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.admins}
            </h3>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Clock size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Active Users</p>
            <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.activeUsers}
            </h3>
            <p className="text-gray-400 text-[10px] lg:text-xs mt-1 lg:mt-2">Last 7 days</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
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
            <option value="admin">Admins</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-gray-600 font-medium">User</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium">Email</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium">Role</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium">Joined</th>
                <th className="text-left py-4 px-6 text-gray-600 font-medium">Last Active</th>
                {userRole === 'admin' && (
                  <th className="text-left py-4 px-6 text-gray-600 font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((targetUser) => (
                <tr key={targetUser.uid || targetUser._id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={targetUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.displayName || targetUser.email)}&background=4F46E5&color=fff`}
                        alt={targetUser.displayName || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{targetUser.displayName || 'Anonymous'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {targetUser.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                      targetUser.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {targetUser.role === 'admin' && <Crown size={12} />}
                      {targetUser.role || 'user'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      {formatDate(targetUser.createdAt)}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {getTimeAgo(targetUser.lastLogin)}
                  </td>
                  {userRole === 'admin' && (
                    <td className="py-4 px-6">
                      {targetUser.uid !== user?.uid && (
                        <button
                          onClick={() => handleRoleChange(
                            targetUser.uid,
                            targetUser.role === 'admin' ? 'user' : 'admin'
                          )}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            targetUser.role === 'admin'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {targetUser.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      )}
                      {targetUser.uid === user?.uid && (
                        <span className="text-xs text-gray-400">You</span>
                      )}
                    </td>
                  )}
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

      {/* Users Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredUsers.map((targetUser) => (
          <div key={targetUser.uid || targetUser._id} className="bg-white rounded-xl shadow-md p-4">
            {/* User Header */}
            <div className="flex items-start gap-3 mb-4">
              <img
                src={targetUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(targetUser.displayName || targetUser.email)}&background=4F46E5&color=fff`}
                alt={targetUser.displayName || 'User'}
                className="w-12 h-12 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {targetUser.displayName || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-600 truncate">{targetUser.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 flex-shrink-0 ${
                targetUser.role === 'admin' 
                  ? 'bg-purple-100 text-purple-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {targetUser.role === 'admin' && <Crown size={12} />}
                {targetUser.role || 'user'}
              </span>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-gray-500 text-xs">Joined</p>
                <p className="text-gray-900 font-medium">{formatDate(targetUser.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Last Active</p>
                <p className="text-gray-900 font-medium">{getTimeAgo(targetUser.lastLogin)}</p>
              </div>
            </div>

            {/* Admin Actions */}
            {userRole === 'admin' && targetUser.uid !== user?.uid && (
              <button
                onClick={() => handleRoleChange(
                  targetUser.uid,
                  targetUser.role === 'admin' ? 'user' : 'admin'
                )}
                className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  targetUser.role === 'admin'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                {targetUser.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
              </button>
            )}
            {userRole === 'admin' && targetUser.uid === user?.uid && (
              <div className="text-center text-sm text-gray-400 py-2">
                This is you
              </div>
            )}
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <UsersIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>

      {/* Info Note */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>📊 Real User Data:</strong> This page shows all registered users from your MongoDB database. 
          Users are automatically saved when they login with Firebase Authentication (Google or Email/Password).
        </p>
      </div>
    </div>
  )
}

export default Users
