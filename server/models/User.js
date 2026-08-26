import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    githubUsername: {
        type: String,
        trim: true
    },
    githubAccessToken: {
        type: String
    },
    githubRefreshToken: {
        type: String
    },
    githubTokenExpiresAt: {
        type: Date
    },
    avatar: {
        type: String
    }
},
    {
        timestamps: true
    }
)

const User = mongoose.model("User", userSchema);
export default User;