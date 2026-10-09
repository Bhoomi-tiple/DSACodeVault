import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  const [showNoteForm, setShowNoteForm] = useState(false);

const [noteForm, setNoteForm] = useState({
  title: "",
  topic: "",
  content: ""
});

  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    topic: "",
    difficulty: "Easy",
    code: "",
    approach: "",
    timeComplexity: "",
    spaceComplexity: "",
    mistakes: "",
    revisionStatus: "New"
  });

  
useEffect(() => {
  fetch("http://localhost:5000/api/problems")
    .then((res) => res.json())
    .then((data) => setProblems(data))
    .catch((err) => console.error("Error loading problems:", err));

  fetch("http://localhost:5000/api/notes")
    .then((res) => res.json())
    .then((data) => setNotes(data))
    .catch((err) => console.error("Error loading notes:", err));
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
const handleNoteChange = (e) => {
  setNoteForm({
    ...noteForm,
    [e.target.name]: e.target.value
  });
};

const handleSaveNote = async () => {
  try {
    const response = await fetch("http://localhost:5000/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(noteForm)
    });

    if (!response.ok) {
      throw new Error("Failed to save note");
    }

    const newNote = await response.json();

    setNotes([...notes, newNote]);

    setNoteForm({
      title: "",
      topic: "",
      content: ""
    });

    setShowNoteForm(false);
  } catch (error) {
    console.error("Error saving note:", error);
    alert("Could not save note. Please try again.");
  }
};


  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const newProblem = await response.json();

      setProblems([...problems, newProblem]);

      setFormData({
        title: "",
        platform: "",
        topic: "",
        difficulty: "Easy",
        code: "",
        approach: "",
        timeComplexity: "",
        spaceComplexity: "",
        mistakes: "",
        revisionStatus: "New"
      });

      setShowForm(false);

    } catch (error) {
      console.error("Error saving problem:", error);
    }
  };

  return (
    <div className="app">

      <aside className="sidebar">
        <h2>⚡ DSA Vault</h2>
        <p className="active">📚 All Problems</p>
        <p
  onClick={() => setShowNotes(true)}
  style={{ cursor: "pointer" }}
>
  📝 My Notes
</p>
        <p>🔖 Bookmarks</p>
        <p>🔄 Revision</p>
      </aside>

      <main className="main">

        <header>
          <div>
            <h1>My Code Vault</h1>
            <p>Your coding journey, organized in one place.</p>
          </div>

          <div className="header-actions">
            <span className="count">
              {problems.length} Problems
            </span>

            <button
              className="add-btn"
              onClick={() => setShowForm(true)}
            >
              + Add Problem
            </button>
          </div>
        </header>

        <section className="welcome">
          <h2>Keep learning. Keep solving. 🚀</h2>
          <p>Every problem you solve makes you a better developer.</p>
        </section>

        {showForm && (
          <div className="form-box">

            <h2>Add New Problem</h2>

            <input
              name="title"
              type="text"
              placeholder="Problem Title"
              value={formData.title}
              onChange={handleChange}
            />

            <input
              name="platform"
              type="text"
              placeholder="Platform (LeetCode, Code360...)"
              value={formData.platform}
              onChange={handleChange}
            />

            <input
              name="topic"
              type="text"
              placeholder="Topic (Graphs, DP, Arrays...)"
              value={formData.topic}
              onChange={handleChange}
            />

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>

            <textarea
              name="code"
              placeholder="C++ Code"
              value={formData.code}
              onChange={handleChange}
            />

            <textarea
              name="approach"
              placeholder="Approach / Intuition"
              value={formData.approach}
              onChange={handleChange}
            />

            <input
              name="timeComplexity"
              type="text"
              placeholder="Time Complexity"
              value={formData.timeComplexity}
              onChange={handleChange}
            />

            <input
              name="spaceComplexity"
              type="text"
              placeholder="Space Complexity"
              value={formData.spaceComplexity}
              onChange={handleChange}
            />

            <textarea
              name="mistakes"
              placeholder="What mistakes did I make?"
              value={formData.mistakes}
              onChange={handleChange}
            />

            <select
              name="revisionStatus"
              value={formData.revisionStatus}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Need Revision</option>
              <option>Mastered</option>
            </select>

            <button onClick={handleSave}>
              Save Problem
            </button>

            <button
              className="close-btn"
              onClick={() => setShowForm(false)}
            >
              Close
            </button>

          </div>
        )}

        
{showNotes && (
  <section className="notes-section">
    <h2 className="section-title">📝 My Notes</h2>
    
<button onClick={() => setShowNoteForm(true)}>
  + Add Note
</button>

{showNoteForm && (
  <div className="form-box">
    <h3>Create New Note</h3>

    <input
      name="title"
      type="text"
      placeholder="Note Title"
      value={noteForm.title}
      onChange={handleNoteChange}
    />

    <input
      name="topic"
      type="text"
      placeholder="Topic (Graphs, DP, Arrays...)"
      value={noteForm.topic}
      onChange={handleNoteChange}
    />

    <textarea
      name="content"
      placeholder="Write your notes here..."
      value={noteForm.content}
      onChange={handleNoteChange}
    />

    <button onClick={handleSaveNote}>
      Save Note
    </button>

    <button onClick={() => setShowNoteForm(false)}>
      Cancel
    </button>
  </div>
)}


    {notes.length === 0 ? (
      <p>No notes saved yet.</p>
    ) : (
      notes.map((note) => (
        <article className="problem-card" key={note._id}>
          <div>
            <h3>{note.title}</h3>
            <span className="tag">{note.topic}</span>
            <p>{note.content}</p>
          </div>
        </article>
      ))
    )}

    <button onClick={() => setShowNotes(false)}>
      Back to Problems
    </button>
  </section>
)}


        {!showNotes && (
  <>
    <h2 className="section-title">Your Saved Problems</h2>

        <section className="problem-list">

          {problems.length === 0 ? (
            <p>No problems saved yet.</p>
          ) : (
            problems.map((problem) => (
              <article
                className="problem-card"
                key={problem._id}
              >
                <div>
                  <h3>{problem.title}</h3>

                  <p>
                    {problem.approach ||
                      "No approach added yet."}
                  </p>

                  <span className="tag">
                    {problem.topic}
                  </span>

                  <span className="tag">
                    {problem.platform}
                  </span>
                </div>

                <span className="difficulty">
                  {problem.difficulty}
                </span>

              </article>
            ))
          )}

        </section>
          </>
)}

      </main>
    </div>
  );
}

export default App;