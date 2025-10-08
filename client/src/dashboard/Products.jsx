import React, { useEffect, useState } from 'react'
import { Package, TrendingUp, DollarSign, ShoppingBag, Search, Filter } from 'lucide-react'
import KBackend from '../utils/constants'

const Products = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('title');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${KBackend.url}/all-books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const categories = [...new Set(books.map(book => book.category))];

  const filteredBooks = books
    .filter(book => {
      const matchesSearch = book.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.authorName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.bookTitle.localeCompare(b.bookTitle);
        case 'price-low':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-high':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const stats = {
    totalProducts: books.length,
    totalValue: books.reduce((sum, book) => sum + parseFloat(book.price || 0), 0),
    avgPrice: books.length > 0 
      ? books.reduce((sum, book) => sum + parseFloat(book.price || 0), 0) / books.length 
      : 0,
    topRated: books.filter(book => (book.rating || 0) >= 4).length
  };

  return (
    <div className="p-4 lg:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mb-8 mt-16 lg:mt-0">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">Product Inventory</h2>
        <p className="text-gray-500">Manage your book collection</p>
      </div>

      {/* Modern Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-8">
        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Package size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Total Products</p>
            <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.totalProducts}
            </h3>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <DollarSign size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Total Value</p>
            <h3 className="text-xl lg:text-3xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              ₹{stats.totalValue.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Avg Price</p>
            <h3 className="text-xl lg:text-3xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              ₹{stats.avgPrice.toFixed(0)}
            </h3>
          </div>
        </div>

        <div className="group bg-white rounded-2xl shadow-lg p-4 lg:p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
          <div className="flex items-start justify-between mb-3 lg:mb-4">
            <div className="p-2 lg:p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag size={20} className="text-white lg:w-6 lg:h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-xs lg:text-sm font-medium uppercase tracking-wider">Top Rated</p>
            <h3 className="text-2xl lg:text-4xl font-bold mt-1 lg:mt-2 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              {stats.topRated}
            </h3>
            <p className="text-gray-400 text-[10px] lg:text-xs mt-1 lg:mt-2">4+ stars</p>
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
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <img 
              src={book.imageUrl} 
              alt={book.bookTitle} 
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 truncate">{book.bookTitle}</h3>
              <p className="text-gray-600 text-sm mb-2 truncate">{book.authorName}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs">
                  {book.category}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-sm font-medium">{(book.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-800">₹{book.price}</span>
                <a 
                  href={`/admin/dashboard/edit-books/${book._id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Edit
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Category Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6 mt-8">
        <h3 className="text-xl font-bold mb-4">Category Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(category => {
            const count = books.filter(book => book.category === category).length;
            const percentage = ((count / books.length) * 100).toFixed(1);
            return (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">{category}</p>
                <p className="text-2xl font-bold mt-1">{count}</p>
                <p className="text-xs text-gray-400 mt-1">{percentage}% of total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
}

export default Products
