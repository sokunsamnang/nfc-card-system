import { Request, Response } from "express";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Profile from "../models/profile.model";
import User from "../models/user.model";
import { getPublicProfileUrl } from "../utils/url.utils";

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Get the user to obtain the publicUrl
        const user = await User.findById(req.user.id);

        // Return profile with publicUrl information
        res.json({
            ...profile.toObject(),
            publicUrl: user?.publicUrl,
            publicProfileUrl: user ? getPublicProfileUrl(user.publicUrl) : null,
        });
    } catch (error) {
        console.error("Error getting profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get public profile by publicUrl
// @route   GET /api/profile/public/:publicUrl
// @access  Public
export const getPublicProfile = async (req: Request, res: Response) => {
    try {
        const { publicUrl } = req.params;

        // Find user by publicUrl
        const user = await User.findOne({ publicUrl });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find profile associated with this user
        const profile = await Profile.findOne({ user: user._id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Return profile with publicUrl information
        res.json({
            ...profile.toObject(),
            publicUrl: user.publicUrl,
            publicProfileUrl: getPublicProfileUrl(user.publicUrl),
        });
    } catch (error) {
        console.error("Error getting public profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Create or update user profile
// @route   POST /api/profile
// @access  Private
export const createProfile = async (req: Request, res: Response) => {
    try {
        const { name, title, company } = req.body;

        // Check if profile exists
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            return res.status(400).json({
                message: "Profile already exists. Use update endpoint instead.",
            });
        }

        // Create new profile
        profile = new Profile({
            user: req.user.id,
            name,
            title: title || "",
            company: company || "",
            photo: "",
            contactLinks: [],
            socialLinks: [],
        });

        await profile.save();
        res.status(201).json(profile);
    } catch (error) {
        console.error("Error creating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name, title, company } = req.body;

        // Check if profile exists
        let profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Update profile fields
        profile.name = name || profile.name;
        profile.title = title || profile.title;
        profile.company = company || profile.company;

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Upload profile photo
// @route   POST /api/profile/photo
// @access  Private
export const uploadProfilePhoto = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // If there's an existing photo, delete it
        if (profile.photo) {
            const oldPhotoPath = path.join(
                __dirname,
                "../../uploads",
                path.basename(profile.photo)
            );
            if (fs.existsSync(oldPhotoPath)) {
                fs.unlinkSync(oldPhotoPath);
            }
        }

        // Set new photo path
        profile.photo = `/uploads/${req.file.filename}`;
        await profile.save();

        res.json({
            message: "Photo uploaded successfully",
            photo: profile.photo,
        });
    } catch (error) {
        console.error("Error uploading photo:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Add contact link
// @route   POST /api/profile/contact
// @access  Private
export const addContactLink = async (req: Request, res: Response) => {
    try {
        const { type, url } = req.body;

        if (!type || !url) {
            return res
                .status(400)
                .json({ message: "Type and URL are required" });
        }

        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check if contact link of this type already exists
        const existingLinkIndex = profile.contactLinks.findIndex(
            (link) => link.type === type
        );

        if (existingLinkIndex !== -1) {
            // Update existing link
            profile.contactLinks[existingLinkIndex].url = url;
        } else {
            // Add new contact link
            profile.contactLinks.push({ type, url });
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error("Error adding contact link:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Remove contact link
// @route   DELETE /api/profile/contact/:id
// @access  Private
export const removeContactLink = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Find contact link index
        const removeIndex = profile.contactLinks.findIndex(
            (link) => link._id?.toString() === req.params.id
        );

        if (removeIndex === -1) {
            return res.status(404).json({ message: "Contact link not found" });
        }

        // Remove the link
        profile.contactLinks.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error("Error removing contact link:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Add social link
// @route   POST /api/profile/social
// @access  Private
export const addSocialLink = async (req: Request, res: Response) => {
    try {
        const { platform, url } = req.body;

        if (!platform || !url) {
            return res
                .status(400)
                .json({ message: "Platform and URL are required" });
        }

        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Check if social link for this platform already exists
        const existingLinkIndex = profile.socialLinks.findIndex(
            (link) => link.platform.toLowerCase() === platform.toLowerCase()
        );

        if (existingLinkIndex !== -1) {
            // Update existing link
            profile.socialLinks[existingLinkIndex].url = url;
        } else {
            // Add new social link
            profile.socialLinks.push({ platform, url });
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error("Error adding social link:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Remove social link
// @route   DELETE /api/profile/social/:id
// @access  Private
export const removeSocialLink = async (req: Request, res: Response) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Find social link index
        const removeIndex = profile.socialLinks.findIndex(
            (link) => link._id?.toString() === req.params.id
        );

        if (removeIndex === -1) {
            return res.status(404).json({ message: "Social link not found" });
        }

        // Remove the link
        profile.socialLinks.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (error) {
        console.error("Error removing social link:", error);
        res.status(500).json({ message: "Server error" });
    }
};
