import React from 'react'
import { ClockLoader } from 'react-spinners'


const MainSpinner = () => {
  return (
    <div className='w-sceen h-screen flex items-center justify-center'>
        <ClockLoader color='#498FCD' size={80}/>
    </div>
  )
}

export default MainSpinner