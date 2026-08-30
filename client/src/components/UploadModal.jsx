import { useState } from "react";
import api from "../services/api";

function UploadModal({ onClose, onUploadSuccess }) {
    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) {
            setFile(null);
            return;
        }

        setError("");

        // Frontend file size validation
        if (selectedFile.size > MAX_FILE_SIZE) {
            setFile(null);
            setError("File size must be less than 10 MB");

            e.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Document title is required");
            return;
        }

        if (!file) {
            setError("Please select a file");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const formData = new FormData();

            formData.append("title", title.trim());
            formData.append("document", file);

            await api.post("/documents/upload", formData);

            onUploadSuccess();
            onClose();

        } catch (error) {
            console.error("Upload error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to upload document"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

                {/* Header */}

                <div className="flex items-center justify-between mb-6">

                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Upload Document
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Add a new document to your vault.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="text-slate-400 hover:text-slate-700 text-xl disabled:opacity-40"
                    >
                        ✕
                    </button>

                </div>

                {/* Error */}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Title */}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Document title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError("");
                            }}
                            placeholder="e.g. Resume 2026"
                            disabled={loading}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                        />
                    </div>

                    {/* File */}

                    <div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Select file
                            </label>

                            <label
                                htmlFor="document-file"
                                className={`group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition ${
                                    file
                                        ? "border-blue-300 bg-blue-50"
                                        : "border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-300"
                                } ${loading ? "pointer-events-none opacity-60" : ""}`}
                            >

                                <div className="w-11 h-11 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl mb-2 group-hover:scale-105 transition">
                                    {file ? "📄" : "📁"}
                                </div>

                                {file ? (
                                    <>
                                        <p className="text-sm font-semibold text-blue-700">
                                            File selected
                                        </p>

                                        <p className="text-xs text-slate-500 mt-1 max-w-[85%] truncate">
                                            {file.name}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Click to choose a file
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            Maximum file size: 10 MB
                                        </p>
                                    </>
                                )}

                                <input
                                    id="document-file"
                                    type="file"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                    className="hidden"
                                />

                            </label>
                        </div>



                        <p className="text-xs text-slate-400 mt-2">
                            Maximum file size: 10 MB
                        </p>
                    </div>

                    {/* Selected file */}

                    {file && (
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                            <div className="flex items-center gap-3">

                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                    📄
                                </div>

                                <div className="min-w-0">

                                    <p className="font-medium text-slate-700 truncate">
                                        {file.name}
                                    </p>

                                    <p className="text-xs text-slate-500 mt-1">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>

                                </div>

                            </div>

                        </div>
                    )}

                    {/* Buttons */}

                    <div className="flex gap-3 pt-2">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60"
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default UploadModal;

