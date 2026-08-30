import fs from "fs";
import path from "path";
import { Document } from "../models/document.model.js";

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Document title is required",
      });
    }

    const document = await Document.create({
      title: title,

      fileName: req.file.originalname,

      filePath: req.file.path,

      fileType: req.file.mimetype,

      fileSize: req.file.size,

      owner: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",

      document,
    });
  } catch (error) {
    console.error("Upload document error:", error);

    return res.status(500).json({
      message: "Something went wrong while uploading document",
    });
  }
};

const getMyDocuments = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;

        const currentPage = Math.max(Number(page), 1);
        const documentsPerPage = Math.max(Number(limit), 1);
        const skip = (currentPage - 1) * documentsPerPage;

        const query = {
            owner: req.user._id
        };

        // Search by title
        if (search.trim()) {
            query.title = {
                $regex: search.trim(),
                $options: "i"
            };
        }

        const totalDocuments = await Document.countDocuments(query);

        const documents = await Document.find(query)
            .sort({
                createdAt: -1
            })
            .skip(skip)
            .limit(documentsPerPage);

        const totalPages = Math.ceil(
            totalDocuments / documentsPerPage
        );

        return res.status(200).json({
            success: true,
            count: documents.length,
            totalDocuments,
            currentPage,
            totalPages,
            documents
        });

    } catch (error) {
        console.error("Get documents error:", error);

        return res.status(500).json({
            message: "Something went wrong while fetching documents"
        });
    }
};

const downloadDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        const filePath = path.resolve(document.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "File not found on server"
            });
        }

        const stat = fs.statSync(filePath);

        if (!stat.isFile()) {
            return res.status(404).json({
                message: "Path is not a file"
            });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodeURIComponent(document.fileName)}"`
        );

        res.setHeader(
            "Content-Type",
            document.fileType || "application/octet-stream"
        );

        res.setHeader(
            "Content-Length",
            stat.size
        );

        const fileStream = fs.createReadStream(filePath);

        fileStream.on("error", (error) => {
            console.error("File stream error:", error);

            if (!res.headersSent) {
                res.status(500).json({
                    message: "Error reading file"
                });
            }
        });

        fileStream.pipe(res);

    } catch (error) {
        console.error("Download error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Something went wrong while downloading"
            });
        }
    }
};

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        const filePath = path.resolve(document.filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await Document.deleteOne({
            _id: document._id
        });

        return res.status(200).json({
            success: true,
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error("Delete document error:", error);

        return res.status(500).json({
            message: "Something went wrong while deleting document"
        });
    }
};

const previewDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        const filePath = path.resolve(document.filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                message: "File not found on server"
            });
        }

        const stat = fs.statSync(filePath);

        if (!stat.isFile()) {
            return res.status(404).json({
                message: "Path is not a file"
            });
        }

        res.setHeader(
            "Content-Type",
            document.fileType || "application/octet-stream"
        );

        res.setHeader(
            "Content-Length",
            stat.size
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename="${encodeURIComponent(document.fileName)}"`
        );

        const fileStream = fs.createReadStream(filePath);

        fileStream.on("error", (error) => {
            console.error("Preview stream error:", error);

            if (!res.headersSent) {
                res.status(500).json({
                    message: "Error reading file"
                });
            }
        });

        fileStream.pipe(res);

    } catch (error) {
        console.error("Preview document error:", error);

        if (!res.headersSent) {
            return res.status(500).json({
                message: "Something went wrong while previewing document"
            });
        }
    }
};

const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        // Title required hai
        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Document title is required"
            });
        }

        const document = await Document.findOne({
            _id: id,
            owner: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        document.title = title.trim();

        await document.save();

        return res.status(200).json({
            success: true,
            message: "Document updated successfully",
            document
        });

    } catch (error) {
        console.error("Update document error:", error);

        return res.status(500).json({
            message: "Something went wrong while updating document"
        });
    }
};

export { deleteDocument, downloadDocument, getMyDocuments, previewDocument, updateDocument, uploadDocument };

