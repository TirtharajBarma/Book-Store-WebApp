import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//react icons
//FaBlog is the name of the icon
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { AuthContext } from '../context/AuthProvider';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);    {/* by default false */}

    // to fetch the user from firebase
    const {user, logout} = useContext(AuthContext);
    
    // Handle logout
    const handleLogout = () => {
        logout().then(() => {
            toast.success('Logged out successfully! 👋', {
                duration: 3000,
                position: 'top-center',
            });
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        }).catch((error) => {
            console.error('Logout error:', error);
            toast.error('Logout failed. Please try again.');
        });
    }

    //toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            }else{
                setIsSticky(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll);
        }
    }, [])

    //navItems
    const navItems = [
        {link : "Home", path: "/"},
        {link : "Shop", path: "/shop"},
        {link : "Sell Your Book", path: "/admin/dashboard"},
    ]

  return (
    <header className='w-full bg-white shadow-md fixed top-0 left-0 right-0 transition-all ease-in duration-300 z-50 backdrop-blur-sm bg-opacity-95'>
        <nav className={`py-3 lg:px-24 px-4 ${isSticky ? "shadow-lg" : ""}`}>
            <div className='flex justify-between items-center gap-8'>
                {/* logo */}
                <Link to="/" className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2 hover:scale-105 transition-transform'>
                    <FaBlog className='text-blue-600'/>
                    <span>Books</span>
                </Link>

                {/* nav items for large devices */}
                <ul className='md:flex space-x-8 hidden'>
                    {
                        navItems.map( ({link, path}) => 
                            <Link 
                                key={path} 
                                to={path} 
                                className='relative text-base font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 group'
                            >
                                {link}
                                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300'></span>
                            </Link>
                        )
                    }
                </ul>

                {/* user info & logout for lg devices */}
                <div className='hidden lg:flex items-center gap-4'>
                    {user ? (
                        <>
                            <div className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full'>
                                {user.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="User" 
                                        className='w-8 h-8 rounded-full'
                                    />
                                ) : (
                                    <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        {(user.displayName || user.email)[0].toUpperCase()}
                                    </div>
                                )}
                                <span className='text-sm font-medium text-gray-700 max-w-[150px] truncate'>
                                    {user.displayName || user.email.split('@')[0]}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className='px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link 
                            to="/login"
                            className='px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg'
                        >
                            Login
                        </Link>
                    )}
                </div>

                {/* menu btn for mobile devices */}
                <div className='md:hidden'>
                    <button 
                        onClick={toggleMenu} 
                        className='p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none'
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? 
                            <FaXmark className='h-6 w-6 text-gray-700'/> : 
                            <FaBarsStaggered className='h-6 w-6 text-gray-700'/>
                        }
                    </button>
                </div>   
            </div>

            {/* navItems for small devices */}
            <div className={`md:hidden fixed top-[60px] left-0 right-0 bg-white shadow-lg z-40 transition-all duration-300 ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}`}>
                <div className='px-4 py-6 space-y-4'>
                    {navItems.map( ({link, path}) => 
                        <Link 
                            key={path} 
                            to={path} 
                            onClick={() => setIsMenuOpen(false)}
                            className='block text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 px-4 py-3 rounded-lg transition-colors'
                        >
                            {link}
                        </Link>
                    )}
                    {user && (
                        <div className='mt-4 pt-4 border-t border-gray-200 space-y-3'>
                            <div className='flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg'>
                                {user.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="User" 
                                        className='w-10 h-10 rounded-full'
                                    />
                                ) : (
                                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold'>
                                        {(user.displayName || user.email)[0].toUpperCase()}
                                    </div>
                                )}
                                <div className='flex flex-col'>
                                    <span className='text-sm font-medium text-gray-900'>
                                        {user.displayName || user.email.split('@')[0]}
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className='w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors'
                            >
                                Logout
                            </button>
                        </div>
                    )}
                    {!user && (
                        <div className='mt-4 pt-4 border-t border-gray-200'>
                            <Link 
                                to="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className='block w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors text-center'
                            >
                                Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    </header>
  )
}

export default Navbar


// md:flex: This class is applied to the <ul> element, indicating that it should display as a flex container on medium-sized screens and larger. This allows the navigation items to be displayed horizontally when there is enough space available.

// md:hidden: This class is applied to the <ul> and <div> elements, indicating that they should be hidden on medium-sized screens and larger. This is often used for elements that should only be visible on smaller screens, such as the menu button for mobile devices.

// lg:flex: This class is applied to the <div> element, indicating that it should display as a flex container on large screens and larger. This is used for the button that toggles the menu on larger screens.