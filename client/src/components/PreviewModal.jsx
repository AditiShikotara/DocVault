import { useEffect, useState } from "react";
import api from "../services/api";

function PreviewModal({ file, onClose }) {
    const [previewUrl, setPreviewUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadPreview = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    `/documents/${file._id}/preview`,
                    {
                        responseType: "blob",
                    }
                );

                const blob = new Blob([response.data], {
                    type: file.fileType || "application/octet-stream",
                });

                const url = window.URL.createObjectURL(blob);

                setPreviewUrl(url);
            } catch (error) {
                console.error("Preview error:", error);

                setError(
                    error.response?.data?.message ||
                    "Failed to preview document"
                );
            } finally {
                setLoading(false);
            }
        };

        loadPreview();

        return () => {
            if (previewUrl) {
                window.URL.revokeObjectURL(previewUrl);
            }
        };
    }, [file]);

    const isPdf = file.fileType === "application/pdf";

    const isImage = file.fileType?.startsWith("image/");

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}

                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">

                    <div className="min-w-0">
                        <h2 className="font-semibold text-slate-900 truncate">
                            {file.title}
                        </h2>

                        <p className="text-sm text-slate-500 truncate">
                            {file.fileName}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="ml-4 text-slate-400 hover:text-slate-700 text-2xl"
                    >
                        ✕
                    </button>

                </div>

                {/* Preview Area */}

                <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4">

                    {loading && (
                        <div className="text-slate-500">
                            Loading preview...
                        </div>
                    )}

                    {!loading && error && (
                        <div className="text-red-600 bg-red-50 px-5 py-4 rounded-xl">
                            {error}
                        </div>
                    )}

                    {!loading && !error && previewUrl && isPdf && (
                        <iframe
                            src={previewUrl}
                            title={file.fileName}
                            className="w-full h-full rounded-lg border border-slate-200 bg-white"
                        />
                    )}

                    {!loading && !error && previewUrl && isImage && (
                        <img
                            src={previewUrl}
                            alt={file.fileName}
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                    )}

                    {!loading && !error && previewUrl && !isPdf && !isImage && (
                        <div className="text-center">

                            <div className="text-5xl mb-4">
                                📄
                            </div>

                            <p className="text-slate-600">
                                Preview is not available for this file type.
                            </p>

                        </div>
                    )}

                </div>

            </div>

        </div>
    );
}

export default PreviewModal;

