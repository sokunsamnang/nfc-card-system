import express from "express";
import {
    getProfile,
    createProfile,
    updateProfile,
    uploadProfilePhoto,
    addContactLink,
    removeContactLink,
    addSocialLink,
    removeSocialLink,
    getPublicProfile,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { uploadMiddleware } from "../middleware/upload.middleware";

const router = express.Router();

// Public route - no authentication required
// @route   GET /api/profile/public/:publicUrl
// @desc    Get user profile by public URL
// @access  Public
router.get("/public/:publicUrl", getPublicProfile);

// All other profile routes require authentication
router.use(authMiddleware);

// @route   GET /api/profile
// @desc    Get current user's profile
// @access  Private
router.get("/", getProfile);

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post("/", createProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put("/", updateProfile);

// @route   POST /api/profile/photo
// @desc    Upload profile photo
// @access  Private
router.post("/photo", uploadMiddleware.single("photo"), uploadProfilePhoto);

// @route   POST /api/profile/contact
// @desc    Add contact link
// @access  Private
router.post("/contact", addContactLink);

// @route   DELETE /api/profile/contact/:id
// @desc    Remove contact link
// @access  Private
router.delete("/contact/:id", removeContactLink);

// @route   POST /api/profile/social
// @desc    Add social link
// @access  Private
router.post("/social", addSocialLink);

// @route   DELETE /api/profile/social/:id
// @desc    Remove social link
// @access  Private
router.delete("/social/:id", removeSocialLink);

export default router;
