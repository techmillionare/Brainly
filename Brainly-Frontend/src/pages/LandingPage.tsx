import { useNavigate } from "react-router-dom";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  BookmarkIcon,
  BoltIcon,
  HeartIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <BookmarkIcon className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">Second Brain</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate("/signin")}
              className="text-base font-medium text-gray-500 hover:text-gray-900"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2">
            <button
              onClick={() => {
                navigate("/signin");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-base font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
            >
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
            <BoltIcon className="h-4 w-4 mr-2" />
            Your Digital Second Brain
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Expand Your <span className="text-purple-600">Mind</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Second Brain helps you capture, organize and retrieve your digital knowledge effortlessly.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
                onClick={() => {
                  const token = localStorage.getItem("token");
                  if (token) {
                    navigate("/dashboard");
                  } else {
                    navigate("/signin");
                  }
                }}
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 flex items-center"
              >
                Access Your Brain
                <ArrowRightIcon className="h-5 w-5 ml-2 inline" />
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 md:py-4 md:text-lg md:px-10 transition-all duration-200"
            >
              Build Your Brain
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Why Second Brain?</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Never lose a thought again
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Your Second Brain remembers everything so you don't have to.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-purple-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center text-sm text-gray-500">
              <span>© {new Date().getFullYear()} Second Brain. All rights reserved.</span>
              <HeartIcon className="h-4 w-4 mx-1 text-red-500" />
              <span>Made with love by Dayanand Mishra</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    name: 'Knowledge Capture',
    description: 'Save articles, videos, and resources with one click. Your Second Brain never forgets what you find valuable.',
    icon: BookmarkIcon,
  },
  {
    name: 'Intuitive Organization',
    description: 'Automatically categorizes content by type and lets you add custom tags for personalized retrieval.',
    icon: ChartBarIcon,
  },
  {
    name: 'Always Available',
    description: 'Access your Second Brain from any device, anywhere. Your knowledge goes where you go.',
    icon: ShieldCheckIcon,
  },
];
