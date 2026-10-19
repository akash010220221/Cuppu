import React from 'react'
import LogoIcon from '../icons/LogoIcon'
import { useNavigate } from 'react-router-dom'

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>


      <header className='w-full p-4 flex justify-center md:p-6 bg-white shadow-sm border-b border-gray-100'>
        <div
          onClick={() => navigate("/")}
          className='flex gap-2 font-bold text-3xl items-center cursor-pointer text-slate-800 hover:text-indigo-600 transition-colors'
        >
          <span className='text-indigo-600'><LogoIcon /></span>
          <p className='tracking-wider'>CUPPU</p>
        </div>
      </header>


      <div className='flex flex-col items-center justify-center grow p-8'>
        <div className='bg-white p-10 md:p-16 rounded-xl shadow-2xl text-center max-w-lg'>


          <p className='text-[120px] md:text-[180px] font-extrabold text-indigo-600 leading-none mb-4'>
            404
          </p>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>
            Page Not Found
          </h1>

          <p className='text-lg text-gray-600 mb-8'>
            Oops! The page you're looking for might have been moved, deleted, or never existed.
          </p>

          <button
            onClick={() => navigate("/")}
            className='bg-indigo-600 text-white 
                                   hover:bg-indigo-700 active:bg-indigo-800
                                   font-semibold py-3 px-8 rounded-lg 
                                   text-xl shadow-lg transition-all 
                                   transform hover:scale-[1.02] cursor-pointer'
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default PageNotFound