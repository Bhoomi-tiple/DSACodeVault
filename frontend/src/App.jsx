import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [problems, setProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showRevision, setShowRevision] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
});

const [dailyActivity, setDailyActivity] = useState([
  { platform: "LeetCode", practiced: false, questions: [] },
  { platform: "Coding Ninjas", practiced: false, questions: [] },
  { platform: "Codeforces", practiced: false, questions: [] }
]);
const [allDailyActivities, setAllDailyActivities] = useState([]);
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

  const searchedProblems = displayedProblems.filter((problem) =>
  problem.title.toLowerCase().includes(searchTerm.toLowerCase())
);

const filteredProblems = searchedProblems.filter((problem) =>
  difficultyFilter === "All" || problem.difficulty === difficultyFilter
);

const sortedProblems = [...filteredProblems].sort((a, b) =>
  sortOrder === "newest"
    ? new Date(b.createdAt) - new Date(a.createdAt)
    : new Date(a.createdAt) - new Date(b.createdAt)
);

const topicFilteredProblems = sortedProblems.filter((problem) =>
  topicFilter === "All" || problem.topic === topicFilter
);

const platformFilteredProblems = topicFilteredProblems.filter((problem) =>
  platformFilter === "All" ||
problem.platform.trim().toLowerCase() === platformFilter
);

  // Total questions solved across all platforms
const totalQuestions = allDailyActivities.reduce(
  (total, activity) => {
    return total + activity.platforms.reduce(
      (count, platform) => count + platform.questions.length,
      0
    );
  },
  0
);

// Total days on which at least one platform was used
const totalActiveDays = allDailyActivities.filter(
  (activity) =>
    activity.platforms.some(
      (platform) =>
        platform.practiced || platform.questions.length > 0
    )
).length;

// Questions solved on each platform
const platformStats = {
  "LeetCode": 0,
  "Coding Ninjas": 0,
  "Codeforces": 0
};

// Get today's date in YYYY-MM-DD format
const today = new Date();
const todayString =
  `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

// Get all active dates
const activeDates = allDailyActivities
  .filter((activity) =>
    activity.platforms.some(
      (platform) =>
        platform.practiced || platform.questions.length > 0
    )
  )
  .map((activity) => activity.date)
  .filter((date) => date <= todayString);

const uniqueActiveDates = [...new Set(activeDates)].sort();

// Calculate longest streak
let longestStreak = 0;
let currentStreakCount = 0;
let previousDate = null;

uniqueActiveDates.forEach((date) => {
  const [year, month, day] = date.split("-").map(Number);
  const currentDate = new Date(year, month - 1, day);

  if (previousDate) {
    const difference =
      (currentDate - previousDate) / (1000 * 60 * 60 * 24);

    if (difference === 1) {
      currentStreakCount++;
    } else {
      currentStreakCount = 1;
    }
  } else {
    currentStreakCount = 1;
  }

  longestStreak = Math.max(longestStreak, currentStreakCount);
  previousDate = currentDate;
});

// Calculate current streak
let currentStreak = 0;

const todayDate = new Date(
  today.getFullYear(),
  today.getMonth(), 
  today.getDate()
);

const yesterday = new Date(todayDate);
yesterday.setDate(yesterday.getDate() - 1);

const latestActiveDate = uniqueActiveDates.length > 0
  ? uniqueActiveDates[uniqueActiveDates.length - 1]
  : null;

if (
  latestActiveDate === todayString ||
  latestActiveDate ===
    `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`
) {
  currentStreak = currentStreakCount;
}

allDailyActivities.forEach((activity) => {
  activity.platforms.forEach((platform) => {
    platformStats[platform.platform] += platform.questions.length;
  });
});

  // Prepare last 30 days for activity calendar
const last30Days = Array.from({ length: 30 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - index));

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
});

const activeDateSet = new Set(activeDates);

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
      setAllDailyActivities(activities);
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
  className={showDashboard ? "active" : ""}
  onClick={() => {
    setShowDashboard(true);
    setShowNotes(false);
    setShowBookmarks(false);
    setShowRevision(false);
    setShowTracker(false);
    setShowForm(false);
  }}
  style={{ cursor: "pointer" }}
>
  📈 Dashboard
</p>
        <p
  className={
    !showDashboard && !showNotes && !showBookmarks && !showRevision && !showTracker
      ? "active"
      : ""
  }
  onClick={() => {
    setShowDashboard(false);
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
            setShowDashboard(false);
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
            setShowDashboard(false);
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
            setShowDashboard(false);
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
            setShowDashboard(false);
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
        {showDashboard && (
  <section className="dashboard-section">

    <h2 className="section-title">📈 Your Coding Dashboard</h2>

    <div className="dashboard-grid">

      <div className="dashboard-card">
        <h3>Total Questions Solved</h3>
        <h2>{totalQuestions}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Total Active Days</h3>
        <h2>{totalActiveDays}</h2>
      </div>

      <div className="dashboard-card">
        <h3>Current Streak 🔥</h3>
        <h2>{currentStreak} Days</h2>
      </div>

      <div className="dashboard-card">
        <h3>Longest Streak 🏆</h3>
        <h2>{longestStreak} Days</h2>
      </div>

    </div>

    <h2 className="section-title">Platform-wise Progress</h2>

    <div className="platform-stats">

      <div className="dashboard-card">
        <h3>LeetCode</h3>
        <h2>{platformStats["LeetCode"]}</h2>
        <p>Questions Solved</p>
      </div>

      <div className="dashboard-card">
        <h3>Coding Ninjas</h3>
        <h2>{platformStats["Coding Ninjas"]}</h2>
        <p>Questions Solved</p>
      </div>

      <div className="dashboard-card">
        <h3>Codeforces</h3>
        <h2>{platformStats["Codeforces"]}</h2>
        <p>Questions Solved</p>
      </div>

    </div>
    <h2 className="section-title">📅 Coding Activity</h2>

<div className="activity-calendar">

  <p className="calendar-description">
    Your coding activity over the last 30 days
  </p>

  <div className="calendar-grid">

    {last30Days.map((date) => (
      <div
        key={date}
        className={`calendar-day ${activeDateSet.has(date) ? "active-day" : ""}`}
        title={date}
      >
      </div>
    ))}

  </div>

  <div className="calendar-legend">
    <span>Less</span>
    <div className="legend-box inactive-day"></div>
    <div className="legend-box active-day"></div>
    <span>More</span>
  </div>

</div>
  </section>
)}

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

        {!showDashboard && !showNotes && !showTracker && (
          <>
            <h2 className="section-title">
              {showBookmarks
                ? "🔖 Bookmarked Problems"
                : showRevision
                ? "🔄 Problems to Revise"
                : "Your Saved Problems"}
            </h2>

            <div className="search-container">

  {/* Topic Filter */}
  <select
    value={topicFilter}
    onChange={(e) => setTopicFilter(e.target.value)}
  >
    <option value="All">All Topics</option>

    {[...new Set(problems.map((problem) => problem.topic))].map((topic) => (
      <option key={topic} value={topic}>
        {topic}
      </option>
    ))}
  </select>

  {/* Platform Filter */}
  <select
    value={platformFilter}
    onChange={(e) => setPlatformFilter(e.target.value)}
  >
    <option value="All">All Platforms</option>

    {[...new Set(
  problems.map((problem) => problem.platform.trim().toLowerCase())
)].map((platform) => (
  <option key={platform} value={platform}>
    {platform === "code 360" || platform === "code360"
      ? "Code360"
      : platform === "codeforces"
      ? "Codeforces"
      : platform}
  </option>
))}
  </select>

  {/* Sort */}
  <select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>

  {/* Difficulty Filter */}
  <select
    value={difficultyFilter}
    onChange={(e) => setDifficultyFilter(e.target.value)}
  >
    <option value="All">All Difficulties</option>
    <option value="Easy">Easy</option>
    <option value="Medium">Medium</option>
    <option value="Hard">Hard</option>
  </select>

  {/* Clear Filters */}
  <button
    type="button"
    onClick={() => {
      setSearchTerm("");
      setTopicFilter("All");
      setDifficultyFilter("All");
      setPlatformFilter("All");
    }}
  >
    Clear Filters
  </button>

  {/* Search */}
  <input
    type="text"
    placeholder="🔍 Search problems by title..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

</div>

            <section className="problem-list">
              {platformFilteredProblems.length === 0 ? (
                <p>
                  {showBookmarks
                    ? "No bookmarks yet. Bookmark a problem to find it here."
                    : showRevision
                    ? "No problems need revision right now. Great work! 🎉"
                    : "No matching problems found. Try changing or clearing your filters."}
                </p>
              ) : (
                platformFilteredProblems.map((problem) => (
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
