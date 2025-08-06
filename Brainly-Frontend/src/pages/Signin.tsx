import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
// import { Backend_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const Signin = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function signin() {
        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        if (!username || !password) {
            toast.error("Please enter both username and password");
            setError("Please enter both username and password");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(`/api/v1/signin`, {
                username,
                password
            });
            
            const jwt = response.data.token;
            localStorage.setItem("token", jwt);
            toast.success(response.data.message);
            navigate("/dashboard");
        } catch (err: any) {
            console.error("Signin failed:", err);
            const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            signin();
        }
    };

    const goToSignup = () => {
        navigate("/signup");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Sign in to access your dashboard</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <Input
                                id="username"
                                ref={usernameRef}
                                placeholder="Enter your username"
                                className="w-full"
                                onKeyPress={handleKeyPress}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    ref={passwordRef}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className="w-full pr-10"
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <Button
                                onClick={signin}
                                loading={isLoading}
                                variant="primary"
                                text={isLoading ? "Signing in..." : "Sign In"}
                                size="lg"
                                fullWidth={true}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <button 
                                onClick={goToSignup}
                                className="font-medium text-purple-600 hover:text-purple-500 hover:underline cursor-pointer"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};