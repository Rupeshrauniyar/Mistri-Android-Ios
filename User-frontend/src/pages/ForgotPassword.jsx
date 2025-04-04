import {Button} from "@/components/ui/button";
import React, {useState, useEffect} from "react";
import axios from "axios";
import SimplePullToRefresh from "@/components/SimplePullToRefresh";
import {Link} from "react-router-dom";
const backendURL = import.meta.env.VITE_BACKEND_URL;
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const sendLink = () => {
    if (email && email.length > 0) {
      axios.post();
    }
  };

  useEffect(() => {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const Data = {
        email,
      };
      const response = await axios.post(`${backendURL}/auth/user/forgot-password`, Data);
      setSuccess(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SimplePullToRefresh onRefresh={() => window.location.reload()}>
      <div className="min-h-screen flex items-center justify-center dark:bg-black bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Forgot your password?</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg animate-fade-in">
              {error}
            </div>
          )}

          {success ? (
            <div className="w-full text-center flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg animate-fade-in">
              {success}.
            </div>
          ) : (
            <>
              <form
                className="mt-8 space-y-6"
                onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors duration-200"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-dark-accent dark:hover:bg-dark-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send Reset Link"
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <Link to="/login">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 flex items-center justify-center mx-auto">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Login
                    </button>
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </SimplePullToRefresh>
  );
};

export default ForgotPassword;
