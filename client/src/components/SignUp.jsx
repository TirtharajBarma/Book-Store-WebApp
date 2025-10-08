import React, { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import AuthForm from './AuthForm'
import KBackend from '../utils/constants'
import toast from 'react-hot-toast'

const SignUp = () => {
  const { createUser, loginWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/";

  const handleSignUp = (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const adminKey = form.adminKey.value;

    const loadingToast = toast.loading('Creating your account...');

    createUser(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        
        import('firebase/auth').then(({ updateProfile }) => {
          updateProfile(user, {
            displayName: name
          }).then(() => {
            fetch(`${KBackend.url}/user/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name,
                photoURL: user.photoURL,
                adminKey: adminKey || null
              })
            })
            .then((response) => response.json())
            .then((data) => {
              toast.success(
                adminKey ? '🎉 Welcome Admin! Account created successfully!' : '✅ Account created successfully!', 
                { id: loadingToast, duration: 3000 }
              );
              setTimeout(() => {
                navigate(from, { replace: true });
              }, 500);
            });
          });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        
        if (errorCode === 'auth/email-already-in-use') {
          toast.error('This email is already registered!', { id: loadingToast });
        } else if (errorCode === 'auth/weak-password') {
          toast.error('Password should be at least 6 characters!', { id: loadingToast });
        } else if (errorCode === 'auth/invalid-email') {
          toast.error('Invalid email address!', { id: loadingToast });
        } else {
          toast.error('Sign up failed. Please try again.', { id: loadingToast });
        }
      });
  };

  const handleGoogleSignUp = () => {
    const loadingToast = toast.loading('Signing up with Google...');
    
    loginWithGoogle()
      .then((result) => {
        toast.success('✅ Signed up with Google successfully!', { 
          id: loadingToast,
          duration: 3000 
        });
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      })
      .catch((error) => {
        toast.error('Google sign up failed. Please try again.', { id: loadingToast });
      });
  };

  return <AuthForm mode="signup" onSubmit={handleSignUp} onGoogleLogin={handleGoogleSignUp} />;
}

export default SignUp
