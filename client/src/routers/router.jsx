import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import Shop from "../shop/Shop";
import About from "../components/About";
import Blog from "../components/Blog";
import SingleBook from "../shop/SingleBook";
import BookReader from "../components/BookReader";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadBook from "../dashboard/UploadBook";
import ManageBooks from "../dashboard/ManageBooks";
import EditBooks from "../dashboard/EditBooks";
import Users from "../dashboard/Users";
import Products from "../dashboard/Products";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import AdminRoute from "../PrivateRoute/AdminRoute";
import KBackend from "../utils/constants";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
            path: '/',
            element: <Home/>
        },
        {
            path: '/shop',
            element: <Shop/>
        },
        {
            path: '/about',
            element: <About/>
        },
        {
            path: '/blog',
            element: <Blog/>
        },
        {
          path: '/book/:id',
          element: <SingleBook/>,
          loader: ({params}) => fetch(`${KBackend.url}/book/${params.id}`)
        }
      ]
    },

    // Book Reader - Separate route (no navbar/footer) - Requires login
    {
      path: '/book/:id/read',
      element: <PrivateRoute><BookReader/></PrivateRoute>,
      loader: ({params}) => fetch(`${KBackend.url}/book/${params.id}`)
    },

    // Admin only routing
    {
      path: "/admin/dashboard",
      element: <AdminRoute><DashboardLayout/></AdminRoute>,
      children: [
        {
          path: "/admin/dashboard",
          element: <Dashboard/>
        },
        {
          path: "/admin/dashboard/upload",
          element: <UploadBook/>
        },
        {
          path: "/admin/dashboard/manage",
          element: <ManageBooks/>
        },
        {
          path: "/admin/dashboard/edit-books/:id",
          element: <EditBooks/>,
          loader: ({params}) => fetch(`${KBackend.url}/book/${params.id}`)
        },
        {
          path: "/admin/dashboard/users",
          element: <Users/>
        },
        {
          path: "/admin/dashboard/products",
          element: <Products/>
        }
      ]
    },
    {
      path: "sign-up",
      element: <SignUp/>
    }, 
    {
      path:"login",
      element: <Login/>
    },
  ]);

  export default router;