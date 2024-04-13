import React, { createContext, useEffect, useState } from 'react'
import app from '../firebase/firebase.config';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { GoogleAuthProvider } from 'firebase/auth';



export const AuthContext = createContext();
// A context object in React is a way to share data across a component tree
const auth = getAuth(app);
// initializes Firebase Authentication using the getAuth function
const GoogleProvider = new GoogleAuthProvider();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
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
      const unsubscribe = onAuthStateChanged(auth, currentUser => {
        // console.log(currentUser);
        setUser(currentUser);
        setLoading(false);
      });
      return () => {
        return unsubscribe();
      }
    }, [])

    const authInfo = {
        user, 
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
