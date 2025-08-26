import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router';

const Navbar = () => {
    const dispatch = useDispatch();
    const { loading, user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="navbar bg-base-300 shadow-md rounded-box px-4 md:px-8">
            <div className="flex-1">
                <Link to={"/"} className="btn btn-ghost normal-case text-xl text-primary font-bold">LeetCode</Link>
            </div>
            <div className="flex-grow flex justify-center">
                {isAuthenticated && user && user.role === 'admin' && ( 
                    <Link to={"/admin"} className="btn btn-ghost normal-case text-lg font-medium text-blue-600 hover:bg-blue-100 rounded-md">
                        Admin Panel
                    </Link>
                )}
            </div>
            <div className="flex-none gap-2">
                {isAuthenticated && user ? (
                    <div className="dropdown dropdown-end">
                        
                        <div className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full border-2 border-gray-300 overflow-hidden">
                                <img alt="User Profile" src="https://placehold.co/100x100/333/FFF?text=U" className="object-cover w-full h-full" />
                            </div>
                        </div>
                        
                        <div tabIndex={0} className="btn normal-case text-lg ml-2 font-semibold text-white hover:bg-gray-200 hover:text-black rounded-md transition-colors duration-200">
                            {user?.firstName || "Guest"} {user?.lastName || "User"}
                        </div>

                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52 text-white">
                            <li>
                                <Link to={"/profile"} className="justify-between hover:bg-primary-focus hover:text-white rounded-md transition-colors duration-200 p-2 my-1">
                                    Profile
                                    <span className="badge badge-primary text-white">New</span>
                                </Link>
                            </li>
                            <li><Link to={"/settings"} className="hover:bg-primary-focus hover:text-white rounded-md transition-colors duration-200 p-2 my-1">Settings</Link></li>
                            <li>
                                <button onClick={handleLogout} className="btn btn-sm btn-block mt-2 bg-red-500 hover:bg-red-600 text-white border-none rounded-md transition-colors duration-200">
                                    {loading ? 'Logging out...' : 'Logout'}
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary text-white rounded-md hover:bg-primary-focus transition-colors duration-200">Login</Link>
                )}
            </div>
        </div>
    );
};

export default Navbar