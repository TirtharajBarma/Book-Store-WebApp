import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

//react icons
//FaBlog is the name of the icon
import { FaBarsStaggered, FaBlog, FaXmark } from "react-icons/fa6";
import { AuthContext } from '../context/AuthProvider';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);    {/* by default false */}

    // to fetch the user from firebase
    const {user} = useContext(AuthContext);
    // console.log(user)

    //toggle menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 100){
                setIsSticky(true);
            }else{
                setIsSticky(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll);
        }
    }, [])

    //navItems
    const navItems = [
        {link : "Home", path: "/"},
        {link : "Shop", path: "/shop"},
        {link : "Sell Your Book", path: "/admin/dashboard/upload"},
    ]

  return (
    <header className='w-full bg-transparent fixed top-0 left-0 right-0 transition-all ease-in duration-300'>
        {/* navbar shade */}
        <nav className={`py-4 lg:px-24 px-4 ${isSticky ? "sticky top-0 left-0 right-0 bg-blue-300" : ""}`}>
            <div className='flex justify-between items-center text-base gap-8'>
                {/* logo */}
                <Link to="/" className='text-2xl font-bold text-blue-700 flex items-centre gap-2'><FaBlog className='inline-block'/>Books</Link>

                {/* nav items for large devices */}
                {/* space btw the navItems */}
                <ul className='md:flex space-x-12 hidden'>
                    {
                        navItems.map( ({link, path}) => <Link key = {path} to={path} className='block text-base text-black uppercase cursor-auto hover:text-blue-700' >{link}</Link>)
                    }
                </ul>

                {/* btn for lg devices */}
                <div className='space-x-12 hidden lg:flex items-center gap-5'>
                    <button><FaBarsStaggered className='w-5 hover:text-blue-700'/></button>
                    {
                        // to show user name
                        user ? user.email : ""
                    }
                </div>

                {/* menu btn for mobile devices */}
                 <div className='md:hidden'>
                    <button onClick={toggleMenu} className='text-black focus:outline-none'>
                        {
                            isMenuOpen ? <FaXmark className='h-5 w-5 text-black'/> : <FaBarsStaggered className='h-5 w-5 text-black'/>
                        }
                    </button>
                </div>   
            </div>

            {/* navItems for small devices */}
            {/* space btw the nav => space-y-4 */}
            {/* padding Y */}
            {/* padding X */}
            {/* margin-top => mt */}
            {/* if menuOpen when show else hide */}
            <div className={`space-y-4 px-4 mt-16 py-7 bg-blue-700 ${isMenuOpen ? "block fixed top-0 right-0 left-0" : "hidden"}`}>
                {
                    navItems.map( ({link, path}) => <Link key={path} to={path} className='block text-base text-white uppercase cursor-pointer'>{link}</Link>)
                }
            </div>
        </nav>
    </header>
  )
}

export default Navbar


// md:flex: This class is applied to the <ul> element, indicating that it should display as a flex container on medium-sized screens and larger. This allows the navigation items to be displayed horizontally when there is enough space available.

// md:hidden: This class is applied to the <ul> and <div> elements, indicating that they should be hidden on medium-sized screens and larger. This is often used for elements that should only be visible on smaller screens, such as the menu button for mobile devices.

// lg:flex: This class is applied to the <div> element, indicating that it should display as a flex container on large screens and larger. This is used for the button that toggles the menu on larger screens.