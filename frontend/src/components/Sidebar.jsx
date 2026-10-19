import { useNavigate } from 'react-router-dom'
import SidebarItem from "./SidebarItem"
import LogoIcon from "../icons/LogoIcon"
import LogoutIcon from "../icons/LogoutIcon"
import HomeIcon from "../icons/HomeIcon"
import ProfileIcon from "../icons/ProfileIcon"
import CouponIcon from "../icons/CouponIcon"
import { BASE_URL } from '../config/config'
import axios from "axios"
import { toast } from "react-toastify"
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, setCoupon, setUser } = useAuth()


  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true, })
      toast.success("See you soon, " + user.firstName)
      navigate("/login")
    } catch (err) {
      toast.error("Logout failed")
      console.error(err)
    }
  }

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(BASE_URL + "/coupon", { withCredentials: true })
      setCoupon(response.data.data)
    } catch (err) {
      toast.error("Error fetching coupons")
    }
  }

  const fetchUser = async () => {
    try {
      const response = await axios.get(BASE_URL + "/verify", { withCredentials: true })
      if (response.status === 200) {
        setUser(response.data.data)
        fetchCoupons()
      }
    } catch (err) {
      if (err.response?.data?.message === "Please Login") {
        navigate("/login")
        toast.warning("Please Login to continue")
      }
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])


  return (
    <div className='h-screen bg-slate-900 text-white border-r border-gray-700 
                        w-16 md:w-52 fixed left-0 top-0 transition-width duration-300 z-50'>

      <div className='flex flex-col h-full items-center'>

        <div
          className='text-2xl cursor-pointer font-extrabold items-center gap-3 pt-6 pb-4 flex justify-center border-b border-gray-700/50'
          onClick={() => navigate("/dashboard")}
        >

          <div className='w-6 h-6 shrink-0 text-indigo-400'>{<LogoIcon />}</div>

          <p className='hidden md:block text-indigo-400'>CUPPU</p>
        </div>


        <nav className='pt-6 flex flex-col  gap-1 grow items-center md:items-start md:px-4'>
          <SidebarItem
            text="Dashboard"
            onClick={() => navigate("/dashboard")}
            icon={<HomeIcon />}
          />
          <SidebarItem
            text="Coupons"
            onClick={() => navigate("/coupons")}
            icon={<CouponIcon />}
          />
        </nav>


        <div className='pb-4 border-t pt-2 border-gray-700/50 flex flex-col gap-1 items-center md:items-start md:px-4'>
          <div className='hidden md:flex flex-col p-4 mb-2 w-full bg-slate-800 rounded-lg text-center'>
            <p className='text-sm font-semibold text-white truncate'>{user?.firstName} {user?.lastName}</p>
            <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
          </div>

          <SidebarItem
            onClick={() => navigate("/profile")}
            text="Profile"
            icon={<ProfileIcon />}
          />
          <SidebarItem
            onClick={handleLogout}
            text="Logout"
            icon={<LogoutIcon />}
            isDanger={true}
          />
        </div>
      </div>
    </div>
  )
}

export default Sidebar