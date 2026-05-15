import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import EmotionDetector from "./utils/emotionDetector";
import ActivitySuggestions from "./utils/activitySuggestions";
import ReminderSystem from "./utils/reminderSystem";

function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Friend");
  const [moods, setMoods] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [emotionDetector] = useState(() => new EmotionDetector(process.env.REACT_APP_GEMINI_API_KEY));
  const [activitySuggestions] = useState(() => new ActivitySuggestions());
  const [reminderSystem] = useState(() => new ReminderSystem());
  const [suggestedActivities, setSuggestedActivities] = useState([]);
  const [analytics, setAnalytics] = useState({
    emotionTrends: [],
    moodPatterns: [],
    moodTrends: [],
    activityEffectiveness: {},
    healthScore: 50,
  });

  const analyzeChatData = useCallback((chatData) => {
    const userMessages = chatData.filter(msg => msg.sender === 'user' && msg.emotion);
    if (userMessages.length > 0) {
      const emotionAnalysis = emotionDetector.analyzeEmotionTrends(userMessages);
      const healthScore = emotionDetector.getEmotionHealthScore(userMessages);

      setAnalytics(prev => ({
        ...prev,
        emotionTrends: emotionAnalysis.allEmotions,
        healthScore,
      }));
    }
  }, [emotionDetector]);

  useEffect(() => {
    let parsedMoods = [];

    try {
      const user = localStorage.getItem("currentUser");
      if (user) {
        const userData = JSON.parse(user);
        setUserName(userData?.name || "Friend");
      }
    } catch (error) {
      console.warn("Invalid currentUser in localStorage", error);
    }

    const moodHistory = localStorage.getItem("moodHistory");
    if (moodHistory) {
      try {
        const parsed = JSON.parse(moodHistory);
        parsedMoods = Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn("Invalid moodHistory in localStorage", error);
        parsedMoods = [];
      }

      setMoods(parsedMoods);
      analyzeMoodData(parsedMoods);
    }

    const chatHistory = localStorage.getItem("chatHistory");
    if (chatHistory) {
      try {
        const parsedChats = JSON.parse(chatHistory);
        setChatMessages(Array.isArray(parsedChats) ? parsedChats : []);
        analyzeChatData(Array.isArray(parsedChats) ? parsedChats : []);
      } catch (error) {
        console.warn("Invalid chatHistory in localStorage", error);
        setChatMessages([]);
      }
    }

    // Request notification permission
    reminderSystem.requestPermission();

    // Generate activity suggestions based on current mood
    const currentMood = parsedMoods.length > 0 ? parsedMoods[parsedMoods.length - 1] : null;
    if (currentMood) {
      const suggestions = activitySuggestions.getPersonalizedSuggestions(parsedMoods, getEmotionFromMood(currentMood.value));
      setSuggestedActivities(suggestions);
    }
  }, [activitySuggestions, analyzeChatData, reminderSystem]);

  const getEmotionFromMood = (moodValue) => {
    if (moodValue >= 4) return 'happy';
    if (moodValue >= 3) return 'calm';
    if (moodValue >= 2) return 'confused';
    return 'sad';
  };

  const analyzeMoodData = (moodData) => {
    if (!Array.isArray(moodData) || moodData.length === 0) return;

    // Prepare data for charts
    const moodTrends = moodData.slice(-14).map((mood, index) => ({
      day: `Day ${index + 1}`,
      mood: mood.value,
      date: mood.date,
    }));

    // Mood patterns by day of week
    const dayPatterns = {};
    moodData.forEach(mood => {
      const day = new Date(mood.date).toLocaleDateString('en-US', { weekday: 'long' });
      if (!dayPatterns[day]) dayPatterns[day] = [];
      dayPatterns[day].push(mood.value);
    });

    const moodPatterns = Object.entries(dayPatterns).map(([day, values]) => ({
      day: day.slice(0, 3),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
    }));

    setAnalytics(prev => ({
      ...prev,
      moodPatterns,
      moodTrends,
    }));
  };

  const todayMood = moods.length > 0 ? moods[moods.length - 1] : null;
  const averageMood = moods.length > 0
    ? (moods.reduce((sum, m) => sum + m.value, 0) / moods.length).toFixed(1)
    : "N/A";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  };

  const handleActivityComplete = (activityTitle) => {
    // Record activity completion
    const completion = {
      activity: activityTitle,
      completedAt: new Date().toISOString(),
      mood_before: todayMood?.value || 3,
      mood_after: Math.min(5, (todayMood?.value || 3) + 0.5), // Assume slight improvement
    };

    const completions = JSON.parse(localStorage.getItem('activityCompletions') || '[]');
    completions.push(completion);
    localStorage.setItem('activityCompletions', JSON.stringify(completions));

    // Update suggestions
    setSuggestedActivities(prev => prev.filter(a => a.title !== activityTitle));
  };

  const COLORS = ['#FFD700', '#87CEEB', '#98FB98', '#DDA0DD', '#F0E68C'];

  return (
    <div className="dashboard-page container slide-in">
      <div className="dashboard-header glass-card">
        <div className="header-content">
          <h1>Welcome back, {userName}</h1>
          <p>Your mental wellness journey continues</p>
          <div className="health-score">
            <div className="score-display">
              <span className="score-label">Emotional Health Score</span>
              <span className="score-value">{analytics.healthScore}/100</span>
            </div>
            <div className="score-bar">
              <div
                className="score-fill"
                style={{ width: `${analytics.healthScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section wellness-section glass-card">
          <h2>Your Wellness Overview</h2>
          <div className="overview-cards">
            <div className="overview-card mood-card">
              <div className="card-icon mood-icon"></div>
              <div className="card-content">
                <h3>Today's Mood</h3>
                <p className="card-value">
                  {todayMood ? `${todayMood.mood} (${todayMood.value}/5)` : "Not logged yet"}
                </p>
              </div>
            </div>

            <div className="overview-card tracker-card">
              <div className="card-icon trend-icon"></div>
              <div className="card-content">
                <h3>Mood Entries</h3>
                <p className="card-value">{moods.length}</p>
                <p className="card-subtitle">Average: {averageMood}/5</p>
              </div>
            </div>

            <div className="overview-card chat-card">
              <div className="card-icon chat-icon"></div>
              <div className="card-content">
                <h3>Chat Messages</h3>
                <p className="card-value">{chatMessages.length}</p>
                <p className="card-subtitle">Conversations</p>
              </div>
            </div>
          </div>
        </div>

        {analytics.moodTrends.length > 0 && (
          <div className="dashboard-section analytics-section glass-card">
            <h2>Mood Analytics</h2>
            <div className="charts-grid">
              <div className="chart-container">
                <h3>14-Day Mood Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={analytics.moodTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="mood" stroke="#667eea" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Mood by Day of Week</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={analytics.moodPatterns}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis domain={[1, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#764ba2" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {analytics.emotionTrends.length > 0 && (
          <div className="dashboard-section emotion-section glass-card">
            <h2>Emotion Analysis</h2>
            <div className="emotion-pie-chart">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analytics.emotionTrends.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ emotion, percentage }) => `${emotion} ${percentage}%`}
                  >
                    {analytics.emotionTrends.slice(0, 5).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {suggestedActivities.length > 0 && (
          <div className="dashboard-section suggestions-section glass-card">
            <h2>Suggested Activities</h2>
            <div className="suggestions-list">
              {suggestedActivities.slice(0, 3).map((activity, index) => (
                <div key={index} className="suggestion-card">
                  <div className="suggestion-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.desc}</p>
                    <span className="activity-meta">
                      {activity.category} • {activity.duration} min
                    </span>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={() => handleActivityComplete(activity.title)}
                  >
                    ✓ Done
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="dashboard-section features-section glass-card">
          <h2>Features & Tools</h2>
          <div className="feature-grid">
            <Link to="/chat" className="feature-card">
              <div className="feature-icon feature-chat"></div>
              <h3>AI Chat Support</h3>
              <p>Talk to your mental health assistant with emotion detection</p>
              <span className="feature-arrow">→</span>
            </Link>

            <Link to="/mood-tracker" className="feature-card">
              <div className="feature-icon feature-mood"></div>
              <h3>Mood Tracker</h3>
              <p>Track emotions & visualize your progress with charts</p>
              <span className="feature-arrow">→</span>
            </Link>

            <Link to="/wellness" className="feature-card">
              <div className="feature-icon feature-wellness"></div>
              <h3>Wellness Guides</h3>
              <p>Meditation, breathing & mindfulness exercises</p>
              <span className="feature-arrow">→</span>
            </Link>

            <Link to="/resources" className="feature-card">
              <div className="feature-icon feature-resources"></div>
              <h3>Resources</h3>
              <p>Articles, tips & mental health support resources</p>
              <span className="feature-arrow">→</span>
            </Link>
          </div>
        </div>

        {todayMood && (
          <div className="dashboard-section mood-detail glass-card">
            <h2>📝 Today's Entry</h2>
            <div className="mood-detail-card">
              <div className="mood-emoji">{todayMood.mood}</div>
              <div className="mood-info">
                <p className="mood-date">{todayMood.date}</p>
                {todayMood.notes && (
                  <p className="mood-notes">
                    <strong>Your notes:</strong> {todayMood.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-tips glass-card">
        <h3>💡 Daily Tip for Mental Wellness</h3>
        <p>
          Take a moment to breathe deeply. Notice 5 things you can see, 4 things you can touch,
          3 things you can hear, 2 things you can smell, and 1 thing you can taste. This grounding
          technique can help reduce anxiety and bring you back to the present moment.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;