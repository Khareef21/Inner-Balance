import React, { useState, useEffect, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

function MoodTracker() {
  const [moods, setMoods] = useState([]);
  const [todayMood, setTodayMood] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchMoods = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/mood`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setMoods(data.moodEntries);
      }
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    }
  }, [token]);

  useEffect(() => {
    fetchMoods();
  }, [fetchMoods]);

  const moodOptions = [
    { label: "Terrible", value: 1 },
    { label: "Low", value: 2 },
    { label: "Okay", value: 3 },
    { label: "Good", value: 4 },
    { label: "Excellent", value: 5 },
  ];

  const saveMood = async (e) => {
    e.preventDefault();
    if (!todayMood) {
      setError("Please select a mood");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/mood`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mood: todayMood.label,
          value: todayMood.value,
          notes
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save mood");
      }

      // Refresh moods
      await fetchMoods();
      setTodayMood("");
      setNotes("");
      alert("Mood saved successfully.");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save mood");
    } finally {
      setLoading(false);
    }
  };

  const last7Days = moods.slice(-7).map((m) => ({
    date: m.date.toLocaleDateString(),
    mood: m.value,
    label: m.mood,
  }));

  const moodCounts = moodOptions.map((option) => ({
    name: option.label,
    count: moods.filter(m => m.mood === option.label).length,
  }));

  const averageMood =
    moods.length > 0
      ? (moods.reduce((sum, m) => sum + m.value, 0) / moods.length).toFixed(1)
      : "N/A";

  return (
    <div className="mood-tracker-page">
      <div className="mood-header">
        <h1>Mood Tracker</h1>
        <p>Track your emotional journey and find patterns</p>
      </div>

      <div className="mood-container">
        <div className="mood-input-section">
          <h2>How are you feeling today?</h2>
          <form onSubmit={saveMood}>
            <div className="mood-buttons">
              {moodOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`mood-btn ${todayMood?.label === option.label ? "active" : ""}`}
                  onClick={() => setTodayMood(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <textarea
              placeholder="Add a note about your day (optional)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mood-notes"
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "💾 Save Mood"}
            </button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </div>

        <div className="mood-stats">
          <div className="stat-card">
            <h3>Total Entries</h3>
            <p className="stat-value">{moods.length}</p>
          </div>
          <div className="stat-card">
            <h3>Average Mood</h3>
            <p className="stat-value">{averageMood}/5</p>
          </div>
          <div className="stat-card">
            <h3>Streak</h3>
            <p className="stat-value">
              {moods.length > 0
                ? new Date(moods[moods.length - 1].timestamp).toLocaleDateString() ===
                  new Date().toLocaleDateString()
                  ? "Today"
                  : "No streak"
                : "Start tracking"}
            </p>
          </div>
        </div>
      </div>

      {moods.length > 0 && (
        <div className="mood-charts">
          <div className="chart-container">
            <h2>Last 7 Days Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#3f7edb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container">
            <h2>Mood Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={moodCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1fc8db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {moods.length > 0 && (
        <div className="mood-history">
          <h2>History</h2>
          <div className="history-list">
            {moods
              .slice()
              .reverse()
              .map((entry, idx) => (
                <div key={idx} className="history-item">
                  <div className="history-date">{entry.date}</div>
                  <div className="history-mood">{entry.mood}</div>
                  {entry.notes && <div className="history-notes">{entry.notes}</div>}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodTracker;
