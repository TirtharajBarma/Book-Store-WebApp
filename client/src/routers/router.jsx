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

    // Book Reader - Separate route (no navbar/footer)
    {
      path: '/book/:id/read',
      element: <BookReader/>,
      loader: ({params}) => fetch(`${KBackend.url}/book/${params.id}`)
    },

    // private routing
    {
      path: "/admin/dashboard",
      element: <DashboardLayout/>,
      children: [
        {
          path: "/admin/dashboard",
          element: <PrivateRoute><Dashboard/></PrivateRoute>
        },
        {
          path: "/admin/dashboard/upload",
          element: <PrivateRoute><UploadBook/></PrivateRoute>
        },
        {
          path: "/admin/dashboard/manage",
          element: <PrivateRoute><ManageBooks/></PrivateRoute>
        },
        {
          path: "/admin/dashboard/edit-books/:id",
          element: <PrivateRoute><EditBooks/></PrivateRoute>,
          loader: ({params}) => fetch(`${KBackend.url}/book/${params.id}`)
        },
        {
          path: "/admin/dashboard/users",
          element: <PrivateRoute><Users/></PrivateRoute>
        },
        {
          path: "/admin/dashboard/products",
          element: <PrivateRoute><Products/></PrivateRoute>
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