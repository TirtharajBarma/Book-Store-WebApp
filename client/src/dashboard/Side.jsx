import React, { useContext } from 'react'
import { Badge, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineCloudUpload, HiShoppingBag, HiTable, HiUser, HiViewBoards } from "react-icons/hi";
import { AuthContext } from '../context/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';


const Side = () => {

  const {user, logout} = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from?.pathname || "/";

    const handleLogOut = () => {
        logout().then( () => {
            alert('Sign-out successfully!!')
            navigate(from, {replace: true})
        }).catch((error) => {

        });
    }

  return (
    <Sidebar aria-label="Sidebar with call to action button example">
    <Sidebar.Logo href="#" img={user?.photoURL} imgAlt=""> <p>{user?.displayName || "Demo User"}</p> </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/admin/dashboard" icon={HiChartPie}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/admin/dashboard/upload" icon={HiOutlineCloudUpload}>
            Upload Book
          </Sidebar.Item>
          <Sidebar.Item href="/admin/dashboard/manage" icon={HiInbox}>
            Manage Books
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiUser}>
            Users
          </Sidebar.Item>
          <Sidebar.Item href="#" icon={HiShoppingBag}>
            Products
          </Sidebar.Item>
          <Sidebar.Item onClick={handleLogOut} icon={HiTable}>
            Log out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default Side
