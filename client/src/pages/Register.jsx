import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/auth/register", {
                fullName,
                email,
                password,
            });

            setSuccess("Account created successfully! Redirecting...");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Something went wrong while registering"
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
                        Create your secure document vault.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">
                            Create account
                        </h2>

                        <p className="text-slate-500 text-sm mt-1">
                            Start managing your documents securely.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-5">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Full name
                            </label>

                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px bg-slate-200 flex-1" />
                        <span className="text-xs text-slate-400">
                            OR
                        </span>
                        <div className="h-px bg-slate-200 flex-1" />
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{" "}
                        <Link
                            to="/"
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}

export default Register;