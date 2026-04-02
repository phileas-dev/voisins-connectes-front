import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from "react-router";
import './index.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Services from './pages/Services.jsx';
import Service_detail from './pages/Service_detail.jsx';
import CreateService from './pages/CreateService.jsx';
import MyServices from './pages/MyServices.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  // Routes publiques - visibles sans connexion
  { path: "/services", Component: Services },
  { path: "/service/:id/", Component: Service_detail },
  // Routes protégées - nécessitent une connexion
  { 
    path: "/profile", 
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  { 
    path: "/create-service", 
    element: <ProtectedRoute><CreateService /></ProtectedRoute>
  },
  { 
    path: "/my-services", 
    element: <ProtectedRoute><MyServices /></ProtectedRoute>
  },
  // { path: "*", Component: Page404 },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
