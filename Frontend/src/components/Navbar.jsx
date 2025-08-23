import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router';

const Navbar = () => {
    const dispatch = useDispatch();
    const { loading, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="navbar bg-base-100 shadow-md rounded-box ">
            <div className="flex-1">
                <Link to={"/"} className="btn btn-ghost normal-case text-xl text-primary">LeetCode</Link>
            </div>
            <div className="flex-none gap-2">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="User Profile" src="https://placehold.co/100x100/333/FFF?text=U" />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
                        <li>
                            <Link to={"/profile"} className="justify-between">
                                Profile
                                <span className="badge">New</span>
                            </Link>
                        </li>
                        <li><Link to={"/settings"}>Settings</Link></li>
                        <li><Link onClick={handleLogout}> {
                            loading ? 'Logging out...' : 'Logout'
                        } </Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar