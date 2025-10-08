import React, { useContext } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import AuthForm from './AuthForm'
import toast from 'react-hot-toast'

const Login = () => {
  const { login, loginWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";
  const redirectPath = from.startsWith('/admin') ? '/admin/dashboard' : from;

  const handleLogin = (event) => {
    event.preventDefault();
    const form = event.target;
    const email = form.email.value;
    const password = form.password.value;
    
    const loadingToast = toast.loading('Logging in...');
    
    login(email, password)
      .then((userCredential) => {
        toast.success('✅ Login successful! Welcome back!', { 
          id: loadingToast,
          duration: 3000 
        });
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        
        if (errorCode === 'auth/user-not-found') {
          toast.error(
            <div>
              <strong>No account found!</strong>
              <br />
              <Link to="/sign-up" className="underline">Click here to Sign Up</Link>
            </div>, 
            { id: loadingToast, duration: 5000 }
          );
        } else if (errorCode === 'auth/wrong-password') {
          toast.error('Incorrect password!', { id: loadingToast });
        } else if (errorCode === 'auth/invalid-email') {
          toast.error('Invalid email address!', { id: loadingToast });
        } else if (errorCode === 'auth/invalid-credential') {
          toast.error(
            <div>
              <strong>Invalid credentials!</strong>
              <br />
              <span className="text-sm">Don't have an account? </span>
              <Link to="/sign-up" className="underline text-sm">Sign Up here</Link>
            </div>, 
            { id: loadingToast, duration: 5000 }
          );
        } else {
          toast.error('Login failed. Please try again.', { id: loadingToast });
        }
      });
  };

  const handleGoogleLogin = () => {
    const loadingToast = toast.loading('Logging in with Google...');
    
    loginWithGoogle()
      .then((result) => {
        toast.success('✅ Logged in with Google successfully!', { 
          id: loadingToast,
          duration: 3000 
        });
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 500);
      })
      .catch((error) => {
        toast.error('Google login failed. Please try again.', { id: loadingToast });
      });
  };

  return <AuthForm mode="login" onSubmit={handleLogin} onGoogleLogin={handleGoogleLogin} />;
}

export default Login
