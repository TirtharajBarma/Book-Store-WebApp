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
      return signOut(auth)
    }


    // fetch the current user
    useEffect( () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        // console.log(currentUser);
        setUser(currentUser);
        
        // Save user to MongoDB when they login
        if (currentUser) {
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

            const data = await response.json();
            if (data.user) {
              setUserRole(data.user.role);
            }
          } catch (error) {
            console.error('Error saving user to database:', error);
          }
        }
        
        setLoading(false);
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
