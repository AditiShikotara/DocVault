import { useState } from "react";
import api from "../services/api";

function EditDocumentModal({ document, onClose, onUpdateSuccess }) {
    const [title, setTitle] = useState(document.title || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError("Document title is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            await api.patch(`/documents/${document._id}`, {
                title: title.trim(),
            });

            onUpdateSuccess();
            onClose();

        } catch (error) {
            console.error("Update error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update document"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl">

                {/* Header */}

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

                    <h2 className="text-xl font-semibold text-slate-900">
                        Edit Document
                    </h2>

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-slate-400 hover:text-slate-700 text-2xl"
                    >
                        ✕
                    </button>

                </div>

                {/* Form */}

                <form onSubmit={handleSubmit} className="p-6">

                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Document Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter document title"
                        disabled={loading}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                    />

                    {error && (
                        <div className="mt-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {/* File info */}

                    <div className="mt-4 bg-slate-50 rounded-xl p-4">

                        <p className="text-xs text-slate-500">
                            File
                        </p>

                        <p className="text-sm font-medium text-slate-700 mt-1 truncate">
                            {document.fileName}
                        </p>

                    </div>

                    {/* Buttons */}

                    <div className="flex justify-end gap-3 mt-6">

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditDocumentModal;
