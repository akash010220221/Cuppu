import React from 'react'
import { Route, Routes } from 'react-router-dom'

import { ToastContainer, Zoom } from "react-toastify"
import PageNotFound from './pages/PageNotFound'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'
import Coupons from './pages/Coupons'
import Profile from './pages/Profile'

const App = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route element={<Layout />} >
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/coupons" element={<Coupons />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
        </Route>
        <Route path='*' element={<PageNotFound />}></Route>
      </Routes>
      <ToastContainer autoClose={2000} position='top-right' transition={Zoom} limit={3} />
    </>

  )
}

export default App