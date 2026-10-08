
const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/dsa_vault");
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
    }
}

module.exports = connectDB;
