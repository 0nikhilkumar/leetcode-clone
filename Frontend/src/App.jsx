import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignIn from './pages/Login'
import SignUp from './pages/SignUp'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/authSlice'
import Navbar from './components/Navbar'
import ProfilePage from './pages/Profile'
import SettingsPage from './pages/Settings'
import AdminPage from './pages/Admin'

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <SignIn />} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
        <Route path='/profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path='/settings' element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/admin' element={<AdminPage />} />
      </Routes>
    </>
  )
}

export default App