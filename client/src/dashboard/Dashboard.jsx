import React, { useEffect, useState } from 'react'
import { BookOpen, Users, Star, TrendingUp, ShoppingCart, Eye } from 'lucide-react'
import KBackend from '../utils/constants'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalRatings: 0,
    averageRating: 0,
    recentBooks: []
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${KBackend.url}/all-books`);
      const books = await response.json();
      
      const totalRatings = books.reduce((sum, book) => sum + (book.totalRatings || 0), 0);
      const totalRatingValue = books.reduce((sum, book) => 
        sum + ((book.rating || 0) * (book.totalRatings || 0)), 0
      );
      const avgRating = totalRatings > 0 ? (totalRatingValue / totalRatings) : 0;
      
      setStats({
        totalBooks: books.length,
        totalRatings: totalRatings,
        averageRating: avgRating,
        recentBooks: books.slice(0, 5)
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
          {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full ${color}`}>
          <Icon size={28} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 my-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Total Books"
          value={stats.totalBooks}
          subtitle="In your library"
          color="bg-blue-500"
        />
        <StatCard
          icon={Star}
          title="Total Ratings"
          value={stats.totalRatings}
          subtitle="From users"
          color="bg-yellow-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg Rating"
          value={stats.averageRating.toFixed(1)}
          subtitle="Out of 5.0"
          color="bg-green-500"
        />
        <StatCard
          icon={Eye}
          title="Categories"
          value={new Set(stats.recentBooks.map(b => b.category)).size}
          subtitle="Book genres"
          color="bg-purple-500"
        />
      </div>

      {/* Recent Books */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Books</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-600">Cover</th>
                <th className="text-left py-3 px-4 text-gray-600">Title</th>
                <th className="text-left py-3 px-4 text-gray-600">Author</th>
                <th className="text-left py-3 px-4 text-gray-600">Category</th>
                <th className="text-left py-3 px-4 text-gray-600">Price</th>
                <th className="text-left py-3 px-4 text-gray-600">Rating</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBooks.map((book) => (
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
                  <td className="py-3 px-4 text-gray-600">₹{book.price}</td>
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
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <a
          href="/admin/dashboard/upload"
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
        >
          <BookOpen size={32} className="mb-3" />
          <h4 className="text-lg font-bold">Upload New Book</h4>
          <p className="text-sm opacity-90 mt-1">Add books to your collection</p>
        </a>
        
        <a
          href="/admin/dashboard/manage"
          className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
        >
          <ShoppingCart size={32} className="mb-3" />
          <h4 className="text-lg font-bold">Manage Inventory</h4>
          <p className="text-sm opacity-90 mt-1">Edit or remove books</p>
        </a>
        
        <a
          href="/shop"
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
        >
          <Eye size={32} className="mb-3" />
          <h4 className="text-lg font-bold">View Store</h4>
          <p className="text-sm opacity-90 mt-1">See customer view</p>
        </a>
      </div>
    </div>
  )
}

export default Dashboard
