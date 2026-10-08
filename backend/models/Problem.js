
const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    platform: {
        type: String,
        default: "Other"
    },

    topic: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },

    code: {
        type: String,
        default: ""
    },

    approach: {
        type: String,
        default: ""
    },

    timeComplexity: {
        type: String,
        default: ""
    },

    spaceComplexity: {
        type: String,
        default: ""
    },

    mistakes: {
        type: String,
        default: ""
    },

    revisionStatus: {
        type: String,
        enum: ["New", "Need Revision", "Mastered"],
        default: "New"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Problem", problemSchema);
