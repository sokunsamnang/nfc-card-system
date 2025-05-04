/**
 * Migration script to add publicUrl to existing users
 *
 * Run with: npx ts-node src/utils/migrations/add-public-url.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import crypto from "crypto";
import User from "../../models/user.model";

// Load environment variables
dotenv.config();

// Generate a random URL-friendly string
const generatePublicUrl = () => {
    return crypto.randomBytes(8).toString("hex");
};

const main = async () => {
    try {
        // Connect to MongoDB
        const MONGO_URI =
            process.env.MONGO_URI ||
            "mongodb://localhost:27017/business-card-db";

        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");

        // Find all users without publicUrl
        const users = await User.find({ publicUrl: { $exists: false } });
        console.log(`Found ${users.length} users without publicUrl`);

        // Add publicUrl to each user
        for (const user of users) {
            // Generate a unique publicUrl
            let publicUrl = generatePublicUrl();
            let publicUrlExists = await User.findOne({ publicUrl });

            // In the rare case of collision, regenerate until unique
            while (publicUrlExists) {
                publicUrl = generatePublicUrl();
                publicUrlExists = await User.findOne({ publicUrl });
            }

            // Update the user
            user.publicUrl = publicUrl;
            await user.save();
            console.log(`Added publicUrl ${publicUrl} to user ${user.email}`);
        }

        console.log("Migration completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

// Run the migration
main();
