import React, { useEffect, Suspense, lazy } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './Components/Context/AppContext'
import ProtectedRoute from './Components/ProtectedRoute'
import OwnerRoute from './Components/Owner/OwnerRoute'

// Lazy load components for better performance
const Home = lazy(() => import('./Pages/Home'))
const CarDetails = lazy(() => import('./Pages/CarDetails'))
const Cars = lazy(() => import('./Pages/Cars'))
const MyBookings = lazy(() => import('./Pages/MyBookings'))
const Footer = lazy(() => import('./Components/Footer'))
const Layout = lazy(() => import('./Pages/Owner/Layout'))
const Dashboard = lazy(() => import('./Pages/Owner/Dashboard'))
const AddCar = lazy(() => import('./Pages/Owner/AddCar'))
const ManageCars = lazy(() => import('./Pages/Owner/ManageCars'))
const ManageBookings = lazy(() => import('./Pages/Owner/ManageBookings'))
const Login = lazy(() => import('./Components/Login'))
const UserDashboard = lazy(() => import('./Pages/UserDashboard'))
const About = lazy(() => import('./Pages/About'))
const AI = lazy(() => import('./Pages/AI'))
const Contact = lazy(() => import('./Pages/Contact'))
const Help = lazy(() => import('./Pages/Help'))
const Terms = lazy(() => import('./Pages/Terms'))
const Privacy = lazy(() => import('./Pages/Privacy'))
const Insurance = lazy(() => import('./Pages/Insurance'))
const FAQ = lazy(() => import('./Pages/FAQ'))
const Sitemap = lazy(() => import('./Pages/Sitemap'))
const ManageFeedback = lazy(() => import('./Pages/Owner/ManageFeedback'))

const App = () => {
  const { showLogin, login } = useAppContext();
  const location = useLocation();
  const isOwnerPath = location.pathname.startsWith('/owner');

  // ✅ Handle Google redirect token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // store in context + localStorage
      login(token);

      // remove token param from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [login]);

  return (
    <div>
      <Toaster />
      {showLogin && <Login />}
      {!isOwnerPath && <Navbar />}

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      }>
        <Routes>
          <Route path='/' element={<Home />} />
          {/* Public routes */}
          <Route path='/cars' element={<Cars />} />
          
          {/* Auth protected */}
          <Route element={<ProtectedRoute />}>
            <Route path='/car-details/:id' element={<CarDetails />} />
          </Route>

          {/* Auth protected */}
          <Route element={<ProtectedRoute />}>
            <Route path='/dashboard' element={<UserDashboard />} />
            <Route path='/my-bookings' element={<MyBookings />} />
            <Route path='/ai' element={<AI />} />
          </Route>

          {/* Public informational pages */}
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/help' element={<Help />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/privacy' element={<Privacy />} />
          <Route path='/insurance' element={<Insurance />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/sitemap' element={<Sitemap />} />

          {/* Owner protected */}
          <Route element={<OwnerRoute />}>
            <Route path='/owner' element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path='add-car' element={<AddCar />} />
              <Route path='manage-cars' element={<ManageCars />} />
              <Route path='manage-bookings' element={<ManageBookings />} />
              <Route path='manage-feedback' element={<ManageFeedback />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>

      {!isOwnerPath && <Footer />}
    </div>
  )
}

export default App
