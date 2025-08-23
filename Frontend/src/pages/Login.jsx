import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';

const signInSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});


export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector(state => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signInSchema),
    });

    useEffect(() => {
        if (isAuthenticated) navigate("/");
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        dispatch(loginUser(data));
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 font-sans">
            <div className="card w-full max-w-md bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl font-bold text-center mb-6">Sign In Your Account</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
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
                                        type='password'
                                        placeholder="Enter your password"
                                        className={`input input-bordered w-full pr-10 ${errors.password ? 'input-error' : ''}`}
                                        {...register('password')}
                                    />
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
                                    'Sign In'
                                )}
                            </button>
                        </div>
                        <div className="text-center mt-4">
                            <span className="text-sm">Don't have an account? </span>
                            <Link to="/signup" className="link link-primary text-sm">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
