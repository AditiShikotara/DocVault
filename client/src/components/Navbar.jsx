import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = async () => {
        try {
            // Backend logout
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear frontend authentication data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");

            // Go to login page
            navigate("/");
        }
    };

    return (
        <nav className="bg-white border-b border-slate-200">

            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

                {/* Logo */}

                <div className="flex items-center gap-3">

                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-lg">
                        📚
                    </div>

                    <span className="text-xl font-bold text-slate-900">
                        DocVault
                    </span>

                </div>

                {/* User */}

                <div className="flex items-center gap-4">

                    <div className="hidden sm:block text-right">

                        <p className="text-sm font-semibold text-slate-800">
                            {user?.fullName || "User"}
                        </p>

                        <p className="text-xs text-slate-500">
                            {user?.email || ""}
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                        Logout
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;

