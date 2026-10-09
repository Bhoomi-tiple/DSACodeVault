
const express = require("express");
const PORT = 5000;
const cors = require("cors");
const connectDB = require("./db");
const Problem = require("./models/Problem");
const Note = require("./models/notes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to DSA Code Vault!");
});

// Save a new DSA problem
app.post("/api/problems", async (req, res) => {
    try {
        const problem = await Problem.create(req.body);
        res.status(201).json(problem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all saved problems
app.get("/api/problems", async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


 // Save a new note
app.post("/api/notes", async (req, res) => {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all saved notes
app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


async function startServer() {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

startServer();
