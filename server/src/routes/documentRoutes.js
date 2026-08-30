import express from "express";
import { deleteDocument, downloadDocument, getMyDocuments, previewDocument, updateDocument, uploadDocument } from "../controllers/documentController.js";
import authMiddleware from "../middleware/authmiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

const uploadDocumentMiddleware = (req, res, next) => {
    upload.single("document")(req, res, (error) => {

        if (error) {
            console.error("Upload error:", error);

            if (error.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "File size must be less than 10 MB"
                });
            }

            return res.status(400).json({
                message: error.message || "File upload failed"
            });
        }

        next();
    });
};

router.post(
  "/upload",
  authMiddleware,
  uploadDocumentMiddleware,
  uploadDocument,
);

router.get(
    "/",
    authMiddleware,
    getMyDocuments
);

router.get(
    "/:id/download",
    authMiddleware,
    downloadDocument
);

router.delete(
    "/:id/delete",
    authMiddleware,
    deleteDocument
);

router.get(
    "/:id/preview",
    authMiddleware,
    previewDocument
);

router.patch(
    "/:id",
    authMiddleware,
    updateDocument
);

export default router;
