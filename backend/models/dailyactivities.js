
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }
});

const platformSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ["LeetCode", "Coding Ninjas", "Codeforces"],
        required: true
    },
    practiced: {
        type: Boolean,
        default: false
    },
    questions: {
        type: [questionSchema],
        default: []
    }
});

const dailyActivitySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true
    },
    platforms: {
        type: [platformSchema],
        default: () => [
            { platform: "LeetCode" },
            { platform: "Coding Ninjas" },
            { platform: "Codeforces" }
        ]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("DailyActivity", dailyActivitySchema);
