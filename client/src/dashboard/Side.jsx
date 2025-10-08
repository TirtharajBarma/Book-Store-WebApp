import React, { useContext, useState } from 'react'
import { HiChartPie, HiInbox, HiOutlineCloudUpload, HiShoppingBag, HiUser, HiHome, HiLogout, HiMenu, HiX } from "react-icons/hi";
import { AuthContext } from '../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';


const Side = () => {
  const {user, userRole, logout} = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogOut = () => {
    logout().then( () => {
      toast.success('Logged out successfully! 👋', {
        duration: 3000,
        position: 'top-center',
      });
      setTimeout(() => {
        navigate('/', {replace: true})
        window.history.pushState(null, '', '/');
      }, 500);
    }).catch((error) => {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    });
  }

  const menuItems = [
    { href: '/', icon: HiHome, label: 'Go to Home', color: 'text-blue-600' },
    { href: '/admin/dashboard', icon: HiChartPie, label: 'Dashboard', color: 'text-indigo-600' },
    { href: '/admin/dashboard/upload', icon: HiOutlineCloudUpload, label: 'Upload Book', color: 'text-green-600' },
    { href: '/admin/dashboard/manage', icon: HiInbox, label: 'Manage Books', color: 'text-purple-600' },
    { href: '/admin/dashboard/users', icon: HiUser, label: 'Users', color: 'text-orange-600' },
    { href: '/admin/dashboard/products', icon: HiShoppingBag, label: 'Products', color: 'text-pink-600' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button - Hidden when sidebar is open */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <HiMenu size={24} />
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen
        bg-white border-r border-gray-200 shadow-lg
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-72
      `}>
        <div className="h-full flex flex-col">
          {/* User Profile Section with Close Button */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
            {/* Close Button (Mobile Only) */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-1.5 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
            >
              <HiX size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src={user?.photoURL || 'https://via.placeholder.com/48'} 
                  alt="User" 
                  className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                />
                {userRole === 'admin' && (
                  <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    👑
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 truncate">
                  {user?.displayName || user?.email?.split('@')[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                {userRole === 'admin' && (
                  <span className="text-xs font-medium text-purple-600 mt-0.5 block">Admin Access</span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${isActive(item.href) 
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200' 
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                <item.icon 
                  size={20} 
                  className={isActive(item.href) ? item.color : 'text-gray-400'}
                />
                <span className={`
                  font-medium
                  ${isActive(item.href) ? 'text-gray-800' : 'text-gray-600'}
                `}>
                  {item.label}
                </span>
              </a>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                bg-red-50 hover:bg-red-100 text-red-600
                transition-all duration-200 group"
            >
              <HiLogout size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Side
