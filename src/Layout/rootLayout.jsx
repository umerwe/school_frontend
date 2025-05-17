import React from 'react'
import { Link, Outlet} from 'react-router-dom'

const RootLayout = () => {
  return (
    <div>
      <Link to='/admin-register' className=''>
      Register
      </Link>
      <Outlet />
    </div>
  )
}

export default RootLayout
