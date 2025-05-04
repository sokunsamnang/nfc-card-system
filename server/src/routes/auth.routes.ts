import express from "express";
import { signup, login } from "../controllers/auth.controller";

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a user
// @access  Public
router.post("/signup", signup);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", login);

export default router;
