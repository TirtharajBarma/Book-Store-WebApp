import React, { createContext, useEffect, useState } from 'react'
import app from '../firebase/firebase.config';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut, setPersistence, browserSessionPersistence } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';
import KBackend from '../utils/constants';



export const AuthContext = createContext();
// A context object in React is a way to share data across a component tree
const auth = getAuth(app);
// initializes Firebase Authentication using the getAuth function
const GoogleProvider = new GoogleAuthProvider();

// Session persistence - logout after browser close or 2 hours
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    // user will hold the current user's authentication status and 
    // loading will indicate whether authentication data is being loaded.
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const loginWithGoogle = () => {
      setLoading(true);
      return signInWithPopup(auth, GoogleProvider);
    } 

    const login = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password)
    }

    const logout = () => {
      // Clear role from sessionStorage
      sessionStorage.removeItem('userRole');
      setUserRole(null);
      return signOut(auth)
    }


    // fetch the current user
    useEffect( () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        
        // Save user to MongoDB when they login and fetch role
        if (currentUser) {
          // Keep loading true until role is fetched
          setLoading(true);
          
          try {
            // Refresh token to extend session
            await currentUser.getIdToken(true);
            
            const response = await fetch(`${KBackend.url}/user/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL
              })
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('User data from backend:', data); // Debug log
            
            if (data.user && data.user.role) {
              setUserRole(data.user.role);
              // Store role in sessionStorage for persistence across page refreshes
              sessionStorage.setItem('userRole', data.user.role);
            } else {
              // Default to user role if not found
              setUserRole('user');
              sessionStorage.setItem('userRole', 'user');
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            // Try to get role from sessionStorage as fallback
            const cachedRole = sessionStorage.getItem('userRole');
            if (cachedRole) {
              setUserRole(cachedRole);
            } else {
              setUserRole('user');
            }
          } finally {
            // Always set loading to false after role fetch attempt
            setLoading(false);
          }
        } else {
          // No user logged in
          setUserRole(null);
          sessionStorage.removeItem('userRole');
          setLoading(false);
        }
      });

      // Auto-logout after 2 hours
      const autoLogoutTimer = setTimeout(() => {
        if (auth.currentUser) {
          logout().then(() => {
            console.log('Auto-logged out after 2 hours');
            window.location.href = '/login';
          });
        }
      }, 2 * 60 * 60 * 1000); // 2 hours

      return () => {
        unsubscribe();
        clearTimeout(autoLogoutTimer);
      }
    }, [])

    const authInfo = {
        user, 
        userRole,
        createUser,
        loginWithGoogle,
        loading,
        login,
        logout
    }

  return (

    <AuthContext.Provider value={authInfo}>
        {children}
    </AuthContext.Provider>

  )
}

export default AuthProvider
