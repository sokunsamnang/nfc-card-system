import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import crypto from "crypto";

// Helper function to generate a random URL-friendly string
const generatePublicUrl = () => {
    return crypto.randomBytes(8).toString("hex");
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Generate a unique publicUrl
        let publicUrl = generatePublicUrl();
        let publicUrlExists = await User.findOne({ publicUrl });

        // In the rare case of collision, regenerate until unique
        while (publicUrlExists) {
            publicUrl = generatePublicUrl();
            publicUrlExists = await User.findOne({ publicUrl });
        }

        // Create new user
        const user = new User({
            email,
            password,
            publicUrl,
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1d" }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                publicUrl: user.publicUrl,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || "default_jwt_secret",
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                publicUrl: user.publicUrl,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
