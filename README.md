# ⚡ DSA Code Vault

<p align="center">
  <strong>Your personal space to save, organize, and revise DSA solutions.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React and Vite" />
  <img src="https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js and Express" />
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
</p>

## 📌 About the Project

**DSA Code Vault** is a personal full-stack web application designed to keep Data Structures and Algorithms (DSA) practice organized in one place. It helps me store coding problems, solutions, approaches, complexity details, mistakes, and revision notes instead of scattering them across different files and platforms.

## ✨ Features

- 📝 **Save DSA Problems** — Store problem titles, platforms, topics, and difficulty levels.
- 💻 **Store Solutions** — Keep code and approaches alongside time and space complexity.
- 🔄 **Track Revision Status** — Organize problems as New, Need Revision, or Mastered.
- 📚 **My Notes** — Create and save notes with a title, topic, and content.
- 🗂️ **View Saved Data** — Fetch and display saved problems and notes.
- 🎨 **Dashboard Interface** — Navigate between problems and notes through the sidebar.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development server and build tool |
| HTML & CSS | Structure and styling |
| Node.js | Backend runtime |
| Express.js | Backend server and REST APIs |
| MongoDB | Database for storing problems and notes |
| Mongoose | Connecting the backend to MongoDB |
| Git & GitHub | Version control and code hosting |

## 🔄 How It Works

1. The React frontend displays the dashboard and forms.
2. When I save a problem or note, the frontend sends a request to the backend.
3. Express.js handles the request.
4. Mongoose interacts with MongoDB to store or retrieve data.
5. The saved information is displayed on the website.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/problems` | Fetch all saved problems |
| `POST` | `/api/problems` | Save a new problem |
| `GET` | `/api/notes` | Fetch all saved notes |
| `POST` | `/api/notes` | Save a new note |

## 🚀 Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB running locally

### 1. Clone the Repository

```bash
git clone https://github.com/Bhoomi-tiple/DSACodeVault.git
cd DSACodeVault
```

### 2. Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
node server.js
```

The backend runs at `http://localhost:5000`.

### 3. Start the Frontend

Open a **second terminal** from the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

**Note:** Make sure MongoDB is running before starting the backend. The database connection is configured in `backend/db.js`.

## 📁 Project Structure

```text
DSACodeVault/
├── backend/
│   ├── models/
│   │   ├── Problem.js
│   │   └── notes.js
│   ├── db.js
│   └── server.js
├── frontend/
│   └── src/
│       └── App.jsx
└── README.md
```

*This is a simplified overview of the project structure.*

## 🔮 Future Improvements

- Add functional bookmarks.
- Implement search and filtering for problems.
- Improve revision tracking.
- Enhance the responsive design and user interface.
- Add more features to support DSA preparation.

## 👩‍💻 Author

**Bhoomi Tiple**

- GitHub: [Bhoomi-tiple](https://github.com/Bhoomi-tiple)
- LinkedIn: [Bhoomi Tiple](https://www.linkedin.com/in/bhoomi-tiple-088256330/)

---

<p align="center">
  💜 Learning, solving, and building — one problem at a time.
</p>
