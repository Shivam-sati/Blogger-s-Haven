import React, { useState } from "react";
import Spline from '@splinetool/react-spline';

const RegistrationForm = () => {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full flex flex-col justify-center items-center bg-white p-10 h-screen transition-all duration-500">
        <div className="max-w-sm w-full">
          {!isLogin ? (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Meet George!
              </h1>
              <p className="text-gray-500 mb-8">
                George community recently decided to meet new people, let’s meet.
              </p>

              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="flex items-center mb-6">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-teal-500 focus:ring-2 focus:ring-teal-400 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-teal-500 underline">
                    Terms and Conditions
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-teal-500 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button className="w-full py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600">
                Next Step
              </button>

              <div className="mt-4 text-center text-gray-600">
                Already have an account?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-teal-500 underline"
                >
                  Sign in
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Welcome Back!
              </h1>
              <p className="text-gray-500 mb-8">
                Please sign in to your account to continue.
              </p>

              <div className="mb-4">
                <label
                  htmlFor="login-username"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Username
                </label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="block text-sm text-gray-600 mb-2"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              <button className="w-full py-2 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600">
                Login
              </button>

              <div className="mt-4 text-center text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-teal-500 underline"
                >
                  Register
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-1/2 w-full h-full justify-center items-center bg-teal-100 relative p-10">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-700 underline"
          >
            {isLogin ? "Register" : "Sign in"}
          </button>
        </div>
   
   <Spline 
          scene="https://prod.spline.design/DAN87kmaJEEXf664/scene.splinecode"
          onReady={(spline) => {
            // Adjusting visibility here
            spline.setVisibility('logo', false); // Hiding logo element
          }}
        />
   
       
      </div>
    </div>
  );
};

export default RegistrationForm;
