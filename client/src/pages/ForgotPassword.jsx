import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.post("/auth/forgot-password", {
                email: email.trim(),
            });

            setSuccess(
                response.data.message ||
                "Password reset link has been generated."
            );

            // Development only
            if (response.data.resetUrl) {
                console.log("Reset URL:", response.data.resetUrl);
            }

        } catch (error) {
            console.error("Forgot password error:", error);

            setError(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl text-2xl shadow-lg shadow-blue-600/20">
                        📚
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 mt-4">
                        DocVault
                    </h1>

                    <p className="text-slate-500 mt-1">
                        Reset your password
                    </p>

                </div>

                {/* Card */}

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">

                    <div className="mb-6">

                        <h2 className="text-xl font-bold text-slate-900">
                            Forgot Password?
                        </h2>

                        <p className="text-sm text-slate-500 mt-2">
                            Enter your registered email and we'll help you reset
                            your password.
                        </p>

                    </div>

                    {/* Success */}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-5">
                            {success}
                        </div>
                    )}

                    {/* Error */}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                    setSuccess("");
                                }}
                                placeholder="you@example.com"
                                disabled={loading}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                            />

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </button>

                    </form>

                    {/* Back to Login */}

                    <div className="text-center mt-6">

                        <Link
                            to="/"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            ← Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;

