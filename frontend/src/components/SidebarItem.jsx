import React from 'react'

const SidebarItem = ({text, icon, onClick}) => {
  return (
    <div onClick={onClick} className='flex gap-3 cursor-pointer py-1 px-2 rounded-md items-center text-white max-w-35 hover:bg-white hover:text-black transition-all'>
        {icon} <p className='hidden md:block'>{text}</p>
    </div>
  )
}

export default SidebarItem