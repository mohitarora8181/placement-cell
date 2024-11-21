import React from 'react'

const Loader = () => {
  return (
    <div className='h-[100vh] w-full flex flex-col text-center gap-5 justify-center align-middle'>
      <div className='h-fit w-fit relative self-center'>
        <img className='self-center top-0 left-0 animate-pulse' src='/lgc.png' />
        <img className='self-center absolute top-1 -left-1.5 animate-spin-slow' src='/lgo.png' />
      </div>
      Loading .... 
    </div>
  )
}

export default Loader
