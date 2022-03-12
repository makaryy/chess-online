import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen w-screen bg-neutral-600 bg-opacity-60 o flex justify-center items-center z-20 absolute'>
      <img src='/icons/spinner.svg' alt='' className='animate-spin w-16 h-16 opacity-100'></img>
      </div>
  )
}

export default Loading