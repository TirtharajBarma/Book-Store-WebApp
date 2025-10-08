import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import MyFooter from './components/MyFooter'
import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
    <Toaster 
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
    <Navbar/>
    <div className='min-h-screen'>
        <Outlet/>
    </div>
      <MyFooter/>
    </>
  )
}

export default App
