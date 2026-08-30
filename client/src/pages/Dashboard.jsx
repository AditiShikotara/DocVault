import { useEffect, useState } from "react";
import DocumentCard from "../components/DocumentCard";
import EditDocumentModal from "../components/EditDocumentModal";
import Navbar from "../components/Navbar";
import PreviewModal from "../components/PreviewModal";
import UploadModal from "../components/UploadModal";
import api from "../services/api";

function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [search, setSearch] = useState("");
    const [previewFile, setPreviewFile] = useState(null);
    const [editDocument, setEditDocument] = useState(null);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/documents");

            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error("Fetch documents error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch documents"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handlePreview = (file) => {
        setPreviewFile(file);
    };

    const handleEdit = (document) => {
        setEditDocument(document);
    };

    // Download document
    const handleDownload = async (file) => {
        try {
            const response = await api.get(
                `/documents/${file._id}/download`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob([response.data], {
                type: file.fileType || "application/octet-stream",
            });

            const url = window.URL.createObjectURL(blob);

            const link = window.document.createElement("a");

            link.href = url;
            link.download = file.fileName;

            window.document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to download document"
            );
        }
    };

    // Delete document
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this document?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/documents/${id}/delete`);

            await fetchDocuments();
        } catch (error) {
            console.error("Delete error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete document"
            );
        }
    };

    // Search documents
    const filteredDocuments = documents.filter((document) => {
        const searchText = search.toLowerCase().trim();

        return (
            document.title?.toLowerCase().includes(searchText) ||
            document.fileName?.toLowerCase().includes(searchText)
        );
    });

    return (
        <div className="min-h-screen bg-slate-50">

            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Header */}

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            My Documents
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Manage all your documents in one place.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                    >
                        + Upload Document
                    </button>

                </div>

                {/* Search */}

                <div className="mb-6">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="🔍  Search your documents..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3.5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />

                </div>

                {/* Error */}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {/* Loading */}

                {loading && (
                    <div className="text-center py-20 text-slate-500">
                        Loading documents...
                    </div>
                )}

                {/* No documents */}

                {!loading &&
                    !error &&
                    documents.length === 0 && (
                        <div className="bg-white border border-dashed border-slate-300 rounded-2xl py-20 text-center">

                            <div className="text-5xl mb-4">
                                📂
                            </div>

                            <h2 className="text-xl font-semibold text-slate-800">
                                No documents yet
                            </h2>

                            <p className="text-slate-500 mt-2">
                                Upload your first document to get started.
                            </p>

                        </div>
                    )}

                {/* Search result empty */}

                {!loading &&
                    documents.length > 0 &&
                    filteredDocuments.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl py-16 text-center">

                            <div className="text-4xl mb-3">
                                🔍
                            </div>

                            <h2 className="text-lg font-semibold text-slate-800">
                                No documents found
                            </h2>

                            <p className="text-slate-500 mt-1">
                                Try searching with a different name.
                            </p>

                        </div>
                    )}

                {/* Documents */}

                {!loading &&
                    filteredDocuments.length > 0 && (
                        <div className="space-y-4">

                            {filteredDocuments.map((document) => (
                                <DocumentCard
                                    key={document._id}
                                    document={document}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                    onPreview={handlePreview}
                                    onEdit={handleEdit}
                                />
                            ))}

                        </div>
                    )}

            </main>

            {previewFile && (
                <PreviewModal
                    file={previewFile}
                    onClose={() => setPreviewFile(null)}
                />
            )}

            {editDocument && (
                <EditDocumentModal
                    document={editDocument}
                    onClose={() => setEditDocument(null)}
                    onUpdateSuccess={fetchDocuments}
                />
            )}

            {/* Upload Modal */}

            {showUploadModal && (
                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    onUploadSuccess={fetchDocuments}
                />
            )}

        </div>
    );
}

export default Dashboard;
