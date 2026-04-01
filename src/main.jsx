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

const router = createBrowserRouter([
  { path: "/", Component: Home,},
  { path: "/login", Component: Login,},
  { path: "/signup", Component: Signup,},
  { path: "/services", Component: Services,},
  { path: "/service/:id/", Component: Service_detail,},
  { path: "/profile", Component: Profile,},
  // { path: "*", Component: Page404 },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
