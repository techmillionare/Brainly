import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import axios from "axios";
// import { Backend_URL } from "../config";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const Signup = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function signup() {
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
            const response = await axios.post(`/api/v1/signup`, {
                username,
                password
            });
            toast.success(response.data.message);
            navigate("/signin");
        } catch (err: any) {
            console.error("Signup failed:", err);
            const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            signup();
        }
    };

    const goToSignin = () => {
        navigate("/signin");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Get started with your new account</p>
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
                                placeholder="Enter username"
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
                                    placeholder="Enter password"
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
                                onClick={signup}
                                loading={isLoading}
                                variant="primary"
                                text={isLoading ? "Creating account..." : "Sign Up"}
                                size="lg"
                                fullWidth={true}
                            />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <button 
                                onClick={goToSignin}
                                className="font-medium text-purple-600 hover:text-purple-500 hover:underline cursor-pointer"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};