import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!password || !confirmPassword) {
            setError("Please fill in both password fields");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                `/auth/reset-password/${token}`,
                {
                    password,
                }
            );

            setSuccess(
                response.data.message ||
                "Password reset successfully"
            );

            setPassword("");
            setConfirmPassword("");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/");
            }, 2000);

        } catch (error) {
            console.error("Reset password error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to reset password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Logo */}

                <div className="text-center mb-8">

                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-2xl shadow-lg shadow-blue-600/30">
                        📚
                    </div>

                    <h1 className="text-3xl font-bold text-white mt-4">
                        DocVault
                    </h1>

                    <p className="text-slate-400 mt-2">
                        Securely reset your password.
                    </p>

                </div>

                {/* Card */}

                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <div className="mb-6">

                        <h2 className="text-2xl font-bold text-slate-900">
                            Reset Password
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Enter your new password below.
                        </p>

                    </div>

                    {/* Error */}

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">
                            {error}
                        </div>
                    )}

                    {/* Success */}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-5">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        {/* New Password */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                New password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Enter new password"
                                disabled={loading}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                                required
                            />

                            <p className="text-xs text-slate-400 mt-2">
                                Password must be at least 6 characters.
                            </p>

                        </div>

                        {/* Confirm Password */}

                        <div>

                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setError("");
                                }}
                                placeholder="Confirm your new password"
                                disabled={loading}
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                                required
                            />

                        </div>

                        {/* Submit */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {loading
                                ? "Resetting..."
                                : "Reset Password"}
                        </button>

                    </form>

                    {/* Back to Login */}

                    <div className="text-center mt-6">

                        <Link
                            to="/"
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            ← Back to Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default ResetPassword;

