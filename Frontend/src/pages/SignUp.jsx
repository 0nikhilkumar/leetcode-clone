import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EyeIcon } from '../components/Icons';
import { Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';

// Define the validation schema using Zod
const signUpSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});


export default function SignUp() {
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signUpSchema),
    });

    useEffect(() => {
        if(isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);
    
    const onSubmit = async (data) => {        
        dispatch(registerUser(data));
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center mb-6">Create Your Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="space-y-4">
                            {/* First Name Input */}
                            <div className="form-control">
                                <label className="label mb-1.5">
                                    <span className="label-text">First Name</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. John"
                                    className={`input input-bordered w-full ${errors.firstName ? 'input-error' : ''}`}
                                    {...register('firstName')}
                                />
                                {errors.firstName && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.firstName.message}</span>
                                    </label>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="form-control">
                                <label className="label mb-1.5">
                                    <span className="label-text">Email Address</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="e.g. john.doe@example.com"
                                    className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.email.message}</span>
                                    </label>
                                )}
                            </div>

                            <div className="form-control">
                                <label className="label mb-1.5">
                                    <span className="label-text">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="btn btn-ghost btn-sm absolute top-1/2 right-1 transform -translate-y-1/2 z-10"
                                        aria-label="Toggle password visibility"
                                    >
                                        <EyeIcon closed={!showPassword} />
                                    </button>
                                </div>
                                {errors.password && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{errors.password.message}</span>
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                                {loading ? (
                                    <span className="loading loading-spinner"></span>
                                ) : (
                                    'Sign Up'
                                )}
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <span className="text-sm">Already have an account? </span>
                            <Link to="/signin" className="link link-primary text-sm">Sign In</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
