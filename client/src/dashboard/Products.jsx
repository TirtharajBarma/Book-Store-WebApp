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
    <div className="px-4 my-12">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Product Inventory</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Products</p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalProducts}</h3>
            </div>
            <div className="p-4 rounded-full bg-blue-500">
              <Package size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Value</p>
              <h3 className="text-2xl font-bold mt-2">₹{stats.totalValue.toLocaleString()}</h3>
            </div>
            <div className="p-4 rounded-full bg-green-500">
              <DollarSign size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Avg Price</p>
              <h3 className="text-2xl font-bold mt-2">₹{stats.avgPrice.toFixed(0)}</h3>
            </div>
            <div className="p-4 rounded-full bg-purple-500">
              <TrendingUp size={28} className="text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Top Rated</p>
              <h3 className="text-3xl font-bold mt-2">{stats.topRated}</h3>
              <p className="text-gray-400 text-xs mt-1">4+ stars</p>
            </div>
            <div className="p-4 rounded-full bg-yellow-500">
              <ShoppingBag size={28} className="text-white" />
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
