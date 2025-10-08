import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Spinner } from 'flowbite-react';

const PrivateRoute = ({children}) => {
    const {user, loading} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    // Prevent back button access after logout
    useEffect(() => {
        if (!user && !loading) {
            // Clear forward history
            window.history.pushState(null, '', window.location.href);
            
            const handlePopState = () => {
                window.history.pushState(null, '', window.location.href);
            };
            
            window.addEventListener('popstate', handlePopState);
            
            return () => {
                window.removeEventListener('popstate', handlePopState);
            };
        }
    }, [user, loading, navigate]);

    if(loading) {
        return <div className='flex justify-center items-center min-h-screen'>
            <Spinner aria-label="Center-aligned spinner example" size="xl" />
        </div>
    }

    if(user){
        return children;
    }

  return (
    <Navigate to="/login" state={{from: location}} replace></Navigate>
  )
}

export default PrivateRoute
