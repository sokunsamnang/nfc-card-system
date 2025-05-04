import mongoose, { Document, Schema } from "mongoose";

export interface SocialLink {
    _id?: mongoose.Types.ObjectId;
    platform: string;
    url: string;
}

export interface ContactLink {
    _id?: mongoose.Types.ObjectId;
    type: string; // email, linkedin, calendly, etc.
    url: string;
}

export interface IProfile extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    title: string;
    company: string;
    photo: string;
    contactLinks: ContactLink[];
    socialLinks: SocialLink[];
}

const ProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            trim: true,
        },
        company: {
            type: String,
            trim: true,
        },
        photo: {
            type: String,
            default: "",
        },
        contactLinks: [
            {
                type: {
                    type: String,
                    required: true,
                    enum: ["email", "phone", "linkedin", "calendly", "website"],
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
        socialLinks: [
            {
                platform: {
                    type: String,
                    required: true,
                },
                url: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    { timestamps: true }
);

const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
export default Profile;
