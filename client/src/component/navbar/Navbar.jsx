import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';


const Navbar = () => {
    const [userdata, setUserdata] = useState(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const token = localStorage.getItem("token")
    const { darkMode, setDarkMode } = useTheme();

    const authsign = async () => {
        const name = user.name
        const email = user.email
        console.log(name, email)
        const res = await axios.post("http://localhost:5000/api/authsignup", { name, email })
        console.log(res)
        localStorage.setItem("id", res.data.userExist._id)
        navigate("/")
    }

    useEffect(() => {
        if (isAuthenticated) {
            authsign()
        }
    }, [isAuthenticated])


    const loaduser = async () => {
        try {
            if (!token) return
            const decoded = jwtDecode(token)
            const id = decoded.id
            localStorage.setItem("id", id)
            const res = await axios.get(`http://localhost:5000/api/getuser/${id}`)
            console.log(res)
            setUserdata(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("token")
        setIsDropdownOpen(false)
        if (isAuthenticated)
            logout({ logoutParams: { returnTo: window.location.origin } })
        navigate("/login")
    }

    useEffect(() => {
        loaduser()
    }, [setUserdata])

    return (
        <div className='flex px-4 items-center justify-between h-20 bg-gray-950 shadow-md text-white'>
            <div><h2 className='text-xl font-bold'><Link to={"/"}>API TESTER ONLINE</Link> </h2></div>
            <div className='relative flex'>
            <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded hover:bg-gray-800"
                    title="Toggle Theme"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {
                    !["/login", "/signup"].includes(location.pathname) && (
                        <>
                            {(token || isAuthenticated) ? (
                                <div className='flex gap-4 items-center'>
                                    <p
                                        className='cursor-pointer hover:text-gray-300'
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {userdata ? userdata.name : user?.name}
                                    </p>
                                    <img
                                        src="/user.png"
                                        alt="avatar"
                                        className='size-9 cursor-pointer'
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    />
                                    {isDropdownOpen && (
                                        <div className='absolute -right-4 mt-48 w-48 bg-gray-950 rounded-b-md shadow-lg py-1 z-10'>
                                            <Link
                                                to="/profile"
                                                className='block px-4 py-2 text-sm hover:bg-gray-700'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                className='block px-4 py-2 text-sm hover:bg-gray-700'
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Dashboard
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-700'
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='flex gap-4 items-center'>
                                    <Link to={"/login"} >Login</Link>
                                    <img
                                        src="/user.png"
                                        alt="avatar"
                                        className='size-9 cursor-pointer'
                                    />
                                </div>
                            )
                            }
                        </>
                    )
                }

            </div>
        </div>
    )
}

export default Navbar

