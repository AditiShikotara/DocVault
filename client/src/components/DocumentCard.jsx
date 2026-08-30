function DocumentCard({
    document,
    onDownload,
    onDelete,
    onPreview,
    onEdit,
}) {
    const formatFileSize = (bytes) => {
        if (!bytes) return "0 KB";

        const mb = bytes / (1024 * 1024);

        if (mb >= 1) {
            return `${mb.toFixed(2)} MB`;
        }

        return `${(bytes / 1024).toFixed(2)} KB`;
    };

    const formatDate = (date) => {
        if (!date) return "";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getFileInfo = (fileType, fileName) => {
        const type = fileType?.toLowerCase() || "";
        const extension = fileName?.split(".").pop()?.toLowerCase();

        if (type === "application/pdf" || extension === "pdf") {
            return {
                icon: "📕",
                label: "PDF",
            };
        }

        if (
            type.includes("word") ||
            extension === "doc" ||
            extension === "docx"
        ) {
            return {
                icon: "📘",
                label: "DOC",
            };
        }

        if (
            type.includes("excel") ||
            type.includes("spreadsheet") ||
            extension === "xls" ||
            extension === "xlsx"
        ) {
            return {
                icon: "📊",
                label: "Excel",
            };
        }

        if (type.startsWith("image/")) {
            return {
                icon: "🖼️",
                label: "Image",
            };
        }

        if (type.startsWith("text/") || extension === "txt") {
            return {
                icon: "📝",
                label: "Text",
            };
        }

        return {
            icon: "📄",
            label: extension?.toUpperCase() || "FILE",
        };
    };

    const fileInfo = getFileInfo(
        document.fileType,
        document.fileName
    );

    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200">

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                {/* File Information */}

                <div className="flex items-center gap-4 min-w-0">

                    {/* File Icon */}

                    <div className="w-14 h-14 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-3xl shrink-0">
                        {fileInfo.icon}
                    </div>

                    {/* Details */}

                    <div className="min-w-0">

                        <div className="flex items-center gap-2">

                            <h3 className="font-semibold text-slate-900 truncate">
                                {document.title}
                            </h3>

                            <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-md shrink-0">
                                {fileInfo.label}
                            </span>

                        </div>

                        <p className="text-sm text-slate-500 mt-1 truncate">
                            {document.fileName}
                        </p>

                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">

                            <span>
                                {formatFileSize(document.fileSize)}
                            </span>

                            {document.createdAt && (
                                <>
                                    <span>•</span>

                                    <span>
                                        {formatDate(document.createdAt)}
                                    </span>
                                </>
                            )}

                        </div>

                    </div>

                </div>

                {/* Actions */}

                <div className="flex flex-wrap gap-2 lg:justify-end">

                    <button
                        onClick={() => onPreview(document)}
                        className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
                    >
                        👁 Preview
                    </button>

                    <button
                        onClick={() => onEdit(document)}
                        className="px-4 py-2 bg-amber-50 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100 transition"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        onClick={() => onDownload(document)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        ⬇ Download
                    </button>

                    <button
                        onClick={() => onDelete(document._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition"
                    >
                        🗑 Delete
                    </button>

                </div>

            </div>

        </div>
    );
}

export default DocumentCard;

