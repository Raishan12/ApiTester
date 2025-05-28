import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
    const [userdata, setUserdata] = useState([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem("token")

    const loaduser = async () => {
        try {
            if (!token) return
            const decoded = jwtDecode(token)
            const id = decoded.id
            const res = await axios.get(`http://localhost:5000/api/getuser/${id}`)
            setUserdata(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("token")
        setIsDropdownOpen(false)
        navigate("/login")
    }

    useEffect(() => {
        if(token)
            navigate("/params")
    }, [token, navigate])

    useEffect(() => {
        loaduser()
    }, [setUserdata])

    return (
        <div className='flex px-4 items-center justify-between h-20 bg-gray-950 shadow-md text-white'>
            <div><h2 className='text-xl font-bold'>API TESTER ONLINE</h2></div>
            <div className='relative'>
                {
                    !["/login", "/signup"].includes(location.pathname) && (
                        <>
                        {token ? (
                            <div className='flex gap-4 items-center'>
                                <p
                                    className='cursor-pointer hover:text-gray-300'
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    {userdata.name}
                                </p>
                                <img
                                    src="/user.png"
                                    alt="avatar"
                                    className='size-9 cursor-pointer'
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                />
                                {isDropdownOpen && (
                                    <div className='absolute -right-5 mt-48 w-48 bg-gray-950 rounded-b-md shadow-lg py-1 z-10'>
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