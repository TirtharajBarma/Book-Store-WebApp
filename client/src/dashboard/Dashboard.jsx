import React, { useEffect, useState } from 'react'
import { BookOpen, Users, Star, TrendingUp, ShoppingCart, Eye, Package } from 'lucide-react'
import KBackend from '../utils/constants'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalRatings: 0,
    averageRating: 0,
    categories: 0,
    totalViews: 0,
    activeUsers: 0
  });
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch real analytics from backend
      const analyticsResponse = await fetch(`${KBackend.url}/analytics/dashboard`);
      const analyticsData = await analyticsResponse.json();

      setStats(analyticsData);

      // Get most popular books (by views and ratings)
      const popularResponse = await fetch(`${KBackend.url}/popular-books?limit=5`);
      const popularData = await popularResponse.json();
      
      setPopularBooks(popularData);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
      <div className="flex items-start justify-between mb-3 lg:mb-4">
        <div className={`p-2 lg:p-3 rounded-xl ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={20} className="text-white lg:w-6 lg:h-6" />
        </div>
      </div>
      <div>
        <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {value}
        </h3>
        {subtitle && <p className="text-gray-400 text-[10px] lg:text-xs mt-1 lg:mt-2">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-8 mt-16 lg:mt-0">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Dashboard Overview</h2>
        <p className="text-gray-500">Monitor your bookstore performance</p>
      </div>
      
      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Total Books"
          value={stats.totalBooks}
          subtitle="In your library"
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active (7 days)`}
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          icon={Star}
          title="Total Ratings"
          value={stats.totalRatings}
          subtitle="From users"
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Rating"
          value={stats.avgRating}
          subtitle="Out of 5.0"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6 mb-8">
        <StatCard
          icon={Eye}
          title="Total Views"
          value={stats.totalViews}
          subtitle="Book page views"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={BookOpen}
          title="Categories"
          value={stats.categories}
          subtitle="Book genres"
          color="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatCard
          icon={ShoppingCart}
          title="Avg Price"
          value={`₹${stats.avgPrice || 0}`}
          subtitle="Per book"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
      </div>

      {/* Most Popular Books (by views and ratings) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">📈 Most Popular Books</h3>
        <p className="text-sm text-gray-500 mb-4">Based on views and user ratings</p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Cover</th>
                <th className="text-left py-3 px-4 text-gray-600">Title</th>
                <th className="text-left py-3 px-4 text-gray-600">Author</th>
                <th className="text-left py-3 px-4 text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-gray-600">Views</th>
                <th className="text-left py-3 px-4 text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              {popularBooks.map((book) => (
                <tr key={book._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <img src={book.imageUrl} alt={book.bookTitle} className="w-12 h-16 object-cover rounded" />
                  </td>
                  <td className="py-3 px-4 font-medium">{book.bookTitle}</td>
                  <td className="py-3 px-4 text-gray-600">{book.authorName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {book.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Eye size={16} className="text-purple-500" />
                      <span className="font-medium">{book.views || 0}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{(book.rating || 0).toFixed(1)}</span>
                      <span className="text-gray-400 text-xs">({book.totalRatings || 0})</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {popularBooks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Eye size={48} className="mx-auto mb-2 opacity-30" />
              <p>No popular books yet. Start getting views!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mt-8">
        <a
          href="/admin/dashboard/upload"
          className="group bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all hover:scale-105 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <BookOpen size={36} className="mb-4 relative z-10" />
          <h4 className="text-xl font-bold relative z-10">Upload New Book</h4>
          <p className="text-sm opacity-90 mt-2 relative z-10">Add books to your collection</p>
        </a>
        
        <a
          href="/admin/dashboard/manage"
          className="group bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all hover:scale-105 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <ShoppingCart size={36} className="mb-4 relative z-10" />
          <h4 className="text-xl font-bold relative z-10">Manage Inventory</h4>
          <p className="text-sm opacity-90 mt-2 relative z-10">Edit or remove books</p>
        </a>
        
        <a
          href="/shop"
          className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 lg:p-8 hover:shadow-2xl transition-all hover:scale-105 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <Eye size={36} className="mb-4 relative z-10" />
          <h4 className="text-xl font-bold relative z-10">View Store</h4>
          <p className="text-sm opacity-90 mt-2 relative z-10">See customer view</p>
        </a>
      </div>
    </div>
  )
}

export default Dashboard
