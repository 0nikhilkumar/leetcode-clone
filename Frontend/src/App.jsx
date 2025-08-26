import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import Navbar from './components/Navbar'
import AdminPage from './pages/Admin'
import HomePage from './pages/HomePage'
import SignIn from './pages/Login'
import ProblemPage from './pages/Problem'
import ProfilePage from './pages/Profile'
import SettingsPage from './pages/Settings'
import SignUp from './pages/SignUp'
import { checkAuth } from './store/authSlice'

const App = () => {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if(loading) {
    return <div className='min-h-screen flex items-center justify-center'>
      <span className='loading loading-spinner loading-lg'></span>
    </div>
  }

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/signup' && <Navbar />}
      <Routes>
        <Route path='/' element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <SignIn />} />
        <Route path='/signup' element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
        <Route path='/profile' element={isAuthenticated ? <div className='flex justify-center items-center min-h-screen'>This Page is under construction</div> : <Navigate to="/login" />} />
        <Route path='/settings' element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" />} />
        <Route path='/problem/:id' element={isAuthenticated ? <ProblemPage /> : <Navigate to="/login" />} />
        <Route path='/admin' element={isAuthenticated && user?.role === 'admin' ? <AdminPage /> : <Navigate to="/" />} />
        
      </Routes>
    </>
  )
}

export default App