import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [problems, setProblems] = useState([]);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
});

const [dailyActivity, setDailyActivity] = useState([
  { platform: "LeetCode", practiced: false, questions: [] },
  { platform: "Coding Ninjas", practiced: false, questions: [] },
  { platform: "Codeforces", practiced: false, questions: [] }
]);

const [questionInputs, setQuestionInputs] = useState({
  "LeetCode": "",
  "Coding Ninjas": "",
  "Codeforces": ""
});

const [activitySaving, setActivitySaving] = useState(false);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("dsa-vault-theme") || "dark";
  });

  const displayedProblems = showBookmarks
    ? problems.filter((problem) => problem.bookmarked === true)
    : showRevision
    ? problems.filter((problem) => problem.revisionStatus === "Need Revision")
    : problems;

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

  const handleBookmark = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/${id}/bookmark`,
        {
          method: "PATCH"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      const updatedProblem = await response.json();

      setProblems((prevProblems) =>
        prevProblems.map((problem) =>
          problem._id === updatedProblem._id ? updatedProblem : problem
        )
      );
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Could not update bookmark. Please try again.");
    }
  };

  const handlePracticeToggle = (platformName) => {
  setDailyActivity((prevActivity) =>
    prevActivity.map((item) =>
      item.platform === platformName
        ? { ...item, practiced: !item.practiced }
        : item
    )
  );
};

const handleQuestionInput = (platformName, value) => {
  setQuestionInputs((prevInputs) => ({
    ...prevInputs,
    [platformName]: value
  }));
};

const handleAddQuestion = (platformName) => {
  const questionName = questionInputs[platformName].trim();

  if (!questionName) {
    return;
  }

  setDailyActivity((prevActivity) =>
    prevActivity.map((item) =>
      item.platform === platformName
        ? {
            ...item,
            practiced: true,
            questions: [...item.questions, questionName]
          }
        : item
    )
  );

  setQuestionInputs((prevInputs) => ({
    ...prevInputs,
    [platformName]: ""
  }));
};

const handleSaveActivity = async () => {
  try {
    setActivitySaving(true);

    const response = await fetch(
      "http://localhost:5000/api/daily-activities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date: selectedDate,
          platforms: dailyActivity.map((item) => ({
            platform: item.platform,
            practiced: item.practiced,
            questions: item.questions.map((title) => ({
              title: title
            }))
          }))
        })
      }
    );

    if (!response.ok) {
      throw new Error("Failed to save activity");
    }

    alert("Daily activity saved successfully! 🎉");

  } catch (error) {
    console.error("Error saving activity:", error);
    alert("Could not save activity. Please try again.");
  } finally {
    setActivitySaving(false);
  }
};

  const handleRevisionChange = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/problems/${id}/revision`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            revisionStatus: newStatus
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update revision status");
      }

      const updatedProblem = await response.json();

      setProblems((prevProblems) =>
        prevProblems.map((problem) =>
          problem._id === updatedProblem._id ? updatedProblem : problem
        )
      );
    } catch (error) {
      console.error("Revision update error:", error);
      alert("Could not update revision status. Please try again.");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("dsa-vault-theme", theme);
  }, [theme]);

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

  useEffect(() => {
  fetch("http://localhost:5000/api/daily-activities")
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to load daily activities");
      }
      return res.json();
    })
    .then((activities) => {
      const savedActivity = activities.find(
        (activity) => activity.date === selectedDate
      );

      if (savedActivity) {
        setDailyActivity(
          savedActivity.platforms.map((item) => ({
            platform: item.platform,
            practiced: item.practiced,
            questions: item.questions.map((question) => question.title)
          }))
        );
      } else {
        setDailyActivity([
          { platform: "LeetCode", practiced: false, questions: [] },
          { platform: "Coding Ninjas", practiced: false, questions: [] },
          { platform: "Codeforces", practiced: false, questions: [] }
        ]);
      }

      setQuestionInputs({
        "LeetCode": "",
        "Coding Ninjas": "",
        "Codeforces": ""
      });
    })
    .catch((error) => {
      console.error("Error loading daily activity:", error);
    });
}, [selectedDate]);

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

      if (!response.ok) {
        throw new Error("Failed to save problem");
      }

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

        <p
          className={
            !showNotes && !showBookmarks && !showRevision && !showTracker
              ? "active"
              : ""
          }
          onClick={() => {
            setShowNotes(false);
            setShowBookmarks(false);
            setShowRevision(false);
            setShowTracker(false);
            setShowForm(false);
          }}
          style={{ cursor: "pointer" }}
        >
          📚 All Problems
        </p>

        <p
          className={showNotes ? "active" : ""}
          onClick={() => {
            setShowNotes(true);
            setShowBookmarks(false);
            setShowRevision(false);
            setShowTracker(false);
            setShowForm(false);
          }}
          style={{ cursor: "pointer" }}
        >
          📝 My Notes
        </p>

        <p
          className={showBookmarks ? "active" : ""}
          onClick={() => {
            setShowBookmarks(true);
            setShowNotes(false);
            setShowRevision(false);
            setShowTracker(false);
            setShowForm(false);
          }}
          style={{ cursor: "pointer" }}
        >
          🔖 Bookmarks
        </p>

        <p
          className={showRevision ? "active" : ""}
          onClick={() => {
            setShowRevision(true);
            setShowBookmarks(false);
            setShowNotes(false);
            setShowTracker(false);
            setShowForm(false);
          }}
          style={{ cursor: "pointer" }}
        >
          🔄 Revision
        </p>

        <p
          className={showTracker ? "active" : ""}
          onClick={() => {
            setShowTracker(true);
            setShowRevision(false);
            setShowBookmarks(false);
            setShowNotes(false);
            setShowForm(false);
          }}
          style={{ cursor: "pointer" }}
        >
          📊 Platform Tracker
        </p>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>My Code Vault</h1>
            <p>Your coding journey, organized in one place.</p>
          </div>

          <div className="header-actions">
            <span className="count">{problems.length} Problems</span>

            <button
              className="theme-toggle"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

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

            <button onClick={handleSave}>Save Problem</button>

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

                <button onClick={handleSaveNote}>Save Note</button>

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

        {showTracker && (
  <section className="tracker-section">

    <h2 className="section-title">
      📊 Daily Coding Activity
    </h2>

    <div className="tracker-date">
      <label>Select Date:</label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />
    </div>

    <div className="platform-grid">

      {dailyActivity.map((item) => (
        <div className="platform-card" key={item.platform}>

          <h3>{item.platform}</h3>

          <label className="practice-checkbox">
            <input
              type="checkbox"
              checked={item.practiced}
              onChange={() => handlePracticeToggle(item.platform)}
            />
            Practised today
          </label>

          <h4>Questions Solved</h4>

          {item.questions.map((question, index) => (
            <div className="tracked-question" key={index}>
              <span>{index + 1}. {question}</span>
            </div>
          ))}

          <div className="question-input">
            <input
              type="text"
              placeholder="Enter question name..."
              value={questionInputs[item.platform]}
              onChange={(e) =>
                handleQuestionInput(item.platform, e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddQuestion(item.platform);
                }
              }}
            />

            <button
              onClick={() => handleAddQuestion(item.platform)}
            >
              Add
            </button>
          </div>

        </div>
      ))}

    </div>

    <button
      className="save-activity-btn"
      onClick={handleSaveActivity}
      disabled={activitySaving}
    >
      {activitySaving ? "Saving..." : "💾 Save Daily Activity"}
    </button>

  </section>
)}

        {!showNotes && !showTracker && (
          <>
            <h2 className="section-title">
              {showBookmarks
                ? "🔖 Bookmarked Problems"
                : showRevision
                ? "🔄 Problems to Revise"
                : "Your Saved Problems"}
            </h2>

            <section className="problem-list">
              {displayedProblems.length === 0 ? (
                <p>
                  {showBookmarks
                    ? "No bookmarks yet. Bookmark a problem to find it here."
                    : showRevision
                    ? "No problems need revision right now. Great work! 🎉"
                    : "No problems saved yet."}
                </p>
              ) : (
                displayedProblems.map((problem) => (
                  <article
                    className="problem-card"
                    key={problem._id}
                  >
                    <div>
                      <h3>{problem.title}</h3>

                      <p>
                        {problem.approach || "No approach added yet."}
                      </p>

                      <span className="tag">{problem.topic}</span>
                      <span className="tag">{problem.platform}</span>
                    </div>

                    <div className="card-actions">
                      <span className="difficulty">
                        {problem.difficulty}
                      </span>

                      <select
                        value={problem.revisionStatus || "New"}
                        onChange={(e) =>
                          handleRevisionChange(problem._id, e.target.value)
                        }
                      >
                        <option value="New">New</option>
                        <option value="Need Revision">Need Revision</option>
                        <option value="Mastered">Mastered</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleBookmark(problem._id)}
                        title={
                          problem.bookmarked
                            ? "Remove bookmark"
                            : "Add bookmark"
                        }
                      >
                        {problem.bookmarked ? "🔖 Saved" : "☆ Bookmark"}
                      </button>
                    </div>
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
