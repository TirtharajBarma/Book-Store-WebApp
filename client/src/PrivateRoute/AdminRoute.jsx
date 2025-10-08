import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate, useLocation } from 'react-router-dom';
import { Spinner } from 'flowbite-react';
import toast from 'react-hot-toast';

const AdminRoute = ({children}) => {
    const {user, userRole, loading, logout} = useContext(AuthContext);
    const location = useLocation();

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
    };

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <Spinner aria-label="Center-aligned spinner example" size="xl" />
        </div>
    }

    // If not logged in, redirect to login
    if(!user){
        return <Navigate to="/login" state={{from: location}} replace />
    }

    // If logged in but not admin, show access denied
    if(userRole !== 'admin'){
        return (
            <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100'>
                <div className='bg-white p-8 rounded-lg shadow-lg max-w-md text-center'>
                    <div className='text-6xl mb-4'>🚫</div>
                    <h1 className='text-2xl font-bold text-gray-800 mb-4'>Access Denied</h1>
                    <p className='text-gray-600 mb-4'>
                        You need admin privileges to access this page.
                    </p>
                    <p className='text-sm text-gray-500 mb-6'>
                        Logged in as: <span className='font-medium'>{user?.displayName || user?.email}</span>
                    </p>
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-3 justify-center'>
                            <a 
                                href="/" 
                                className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition'
                            >
                                Go Home
                            </a>
                            <a 
                                href="/shop" 
                                className='px-6 py-2 border border-gray-300 rounded hover:bg-gray-50 transition'
                            >
                                Browse Books
                            </a>
                        </div>
                        <button
                            onClick={handleLogout}
                            className='px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition'
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return children;
}

export default AdminRoute
