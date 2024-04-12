import React from 'react'
import { Outlet } from 'react-router-dom'
import Side from './Side'

const DashboardLayout = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
      <Side/>
      <Outlet/>
    </div>
  )
}

export default DashboardLayout
