'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                router.push('/dashboard');
            } else {
                // Sign up
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password
                );

                // Update display name
                if (formData.name) {
                    await updateProfile(userCredential.user, {
                        displayName: formData.name,
                    });
                }

                router.push('/dashboard');
            }
        } catch (err: any) {
            console.error('Auth error:', err);

            // User-friendly error messages
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already registered. Please login instead.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email address.');
                    break;
                case 'auth/weak-password':
                    setError('Password should be at least 6 characters.');
                    break;
                case 'auth/user-not-found':
                    setError('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid email or password.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
            }

            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Google sign-in error:', err);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in cancelled.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError('Failed to sign in with Google. Please try again.');
            }

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 cursor-pointer">
                            Urban Living
                        </h1>
                    </Link>
                    <p className="text-gray-600">
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </p>
                </div>

                {/* Auth Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Tab Switcher */}
                    <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${isLogin
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError('');
                            }}
                            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${!isLogin
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name (Sign Up Only) */}
                        {!isLogin && (
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required={!isLogin}
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                required
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                minLength={6}
                            />
                            {!isLogin && (
                                <p className="text-xs text-gray-500 mt-1">
                                    Must be at least 6 characters
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                        >
                            {loading
                                ? 'Please wait...'
                                : isLogin
                                    ? 'Login'
                                    : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Google Sign-In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    {/* Additional Info */}
                    <div className="mt-6 text-center text-sm text-gray-600">
                        {isLogin ? (
                            <p>
                                Don't have an account?{' '}
                                <button
                                    onClick={() => {
                                        setIsLogin(false);
                                        setError('');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Sign up
                                </button>
                            </p>
                        ) : (
                            <p>
                                Already have an account?{' '}
                                <button
                                    onClick={() => {
                                        setIsLogin(true);
                                        setError('');
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Login
                                </button>
                            </p>
                        )}
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <Link
                        href="/"
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
