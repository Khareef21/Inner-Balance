import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { Sun, Moon, Sparkles } from "lucide-react";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Chatbot from "./Chatbot";
import MoodTracker from "./MoodTracker";
import Wellness from "./Wellness";
import Resources from "./Resources";
import EmergencyHelp from "./EmergencyHelp";

import "./theme.css";
import "./animations.css";
import "./glassmorphism.css";
import "./App.css";

// Dropdown menu content data
const menuData = {
  experts: [
    { name: "Therapists", desc: "Safe, compassionate support for your mental health concerns", icon: "icon-therapists" },
    { name: "Psychiatrists", desc: "Expert medical care for complex mental health conditions", icon: "icon-psychiatrists" },
    { name: "Child & Youth Experts", desc: "Specialized support for children backed by clinical expertise", icon: "icon-youth" },
    { name: "Couples Therapists", desc: "Evidence-based therapy for partners to rebuild healthier connection", icon: "icon-couples" }
  ],
  services: [
    { name: "AI Chatbot Support", desc: "Instant 24/7 emotional support", icon: "icon-chatbot" },
    { name: "Mood Tracking", desc: "Monitor your emotional patterns and progress", icon: "icon-mood" },
    { name: "Meditation & Wellness", desc: "Guided meditation and relaxation activities", icon: "icon-meditation" },
    { name: "Therapist Locator", desc: "Find and connect with certified professionals", icon: "icon-search" },
    { name: "Peer Support Community", desc: "Connect with others on similar journeys", icon: "icon-community" },
    { name: "Emergency Help", desc: "Immediate crisis support and resources", icon: "icon-emergency" }
  ],
  conditions: [
    { name: "Depression", link: "#" },
    { name: "Anxiety Disorders", link: "#" },
    { name: "OCD (Obsessive Compulsive Disorder)", link: "#" },
    { name: "Adult ADHD", link: "#" },
    { name: "Addiction & Substance Abuse", link: "#" },
    { name: "Alcohol Addiction", link: "#" },
    { name: "Women's Health", link: "#" },
    { name: "and 13 more...", link: "#" }
  ],
  resources: [
    { name: "Mental Health Articles", link: "/resources" },
    { name: "Self-Help Guides", link: "/resources" },
    { name: "Video Tutorials", link: "/resources" },
    { name: "Research Database", link: "/resources" }
  ]
};

function DropdownMenu({ title, items, type, menuClass = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  const renderIcon = (iconClass) => {
    const iconMap = {
      "icon-therapists": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      "icon-psychiatrists": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 4h12v7H6z"/><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 14h6M9 17h6M9 20h6"/>
        </svg>
      ),
      "icon-youth": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4"/><path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
        </svg>
      ),
      "icon-couples": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="6" cy="7" r="3"/><circle cx="18" cy="7" r="3"/>
        </svg>
      ),
      "icon-chatbot": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><circle cx="9" cy="10" r="1"/><circle cx="12" cy="10" r="1"/><circle cx="15" cy="10" r="1"/>
        </svg>
      ),
      "icon-mood": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
        </svg>
      ),
      "icon-meditation": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="4"/><path d="M12 12c-3 0-6 2-6 4v2h12v-2c0-2-3-4-6-4z"/><path d="M8 18h8"/>
        </svg>
      ),
      "icon-search": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      ),
      "icon-community": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      "icon-emergency": (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6M12 12h6"/>
        </svg>
      )
    };
    
    return iconMap[iconClass] || null;
  };

  if (type === "icons") {
    return (
      <div className={`dropdown-menu ${menuClass}`}>
        <button className="menu-item" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          {title} <span className="dropdown-arrow">▾</span>
        </button>
        {isOpen && (
          <div className="dropdown-content dropdown-icons" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            {items.map((item, index) => (
              <div key={index} className={`dropdown-item-box ${item.icon}`}>
                <div className="item-icon">{renderIcon(item.icon)}</div>
                <div className="item-text">
                  <h4>{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="dropdown-menu">
        <button className="menu-item" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          {title} <span className="dropdown-arrow">▾</span>
        </button>
        {isOpen && (
          <div className="dropdown-content" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            {items.map((item, index) => (
              <Link key={index} to={item.link || "#"} className="dropdown-item">
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }
}

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [zenMode, setZenMode] = useState(false);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAuthenticated = Boolean(token && currentUser?.email);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  if (zenMode) {
    return (
      <div className="zen-shell">
        <div className="zen-overlay">
          <button className="zen-exit" onClick={() => setZenMode(false)}>
            Exit Zen Zone
          </button>

          <div className="zen-zone">
            <div className="zen-hero">
              <div>
                <span className="zen-label">The Zen Zone</span>
                <h1>Curated movements and wellness tools tailored to your current needs.</h1>
                <p>Find calm, reduce stress, and choose the right reset for your mind and body.</p>
                <div className="zen-badges">
                  {['All', 'Anxiety', 'Burnout', 'Low Focus', 'Stress', 'Social Isolation'].map((item) => (
                    <button key={item} className="zen-pill">{item}</button>
                  ))}
                </div>
              </div>
              <div className="zen-hero-card">
                <div className="zen-card-tag">Yoga Poses</div>
                <h2>Balsasana (Child's Pose)</h2>
                <p>A gentle resting pose that helps calm the nervous system and quiet the mind.</p>
                <ul>
                  <li>Kneel on the floor with toes touching.</li>
                  <li>Sit on your heels, then fold forward.</li>
                  <li>Rest your forehead on the floor.</li>
                  <li>Extend arms or rest them beside your body.</li>
                </ul>
              </div>
            </div>

            <div className="zen-cards-grid">
              <div className="zen-card zen-card-large">
                <span className="zen-card-top">Burnout & Fatigue</span>
                <h3>Viparita Leg Extension</h3>
                <p>An excellent restorative pose to reduce swelling and ease a tired mind.</p>
                <div className="zen-card-steps">
                  <p>01 Sit close to a wall.</p>
                  <p>02 Lie back and swing legs up onto the wall.</p>
                  <p>03 Keep back flat on floor.</p>
                  <p>04 Hold for 5–10 minutes with deep breaths.</p>
                </div>
              </div>
              <div className="zen-card zen-card-muted">
                <span className="zen-card-top">Breathing</span>
                <h3>4-7-8 Breathing</h3>
                <p>Slow down your nervous system with a gentle breathing pattern.</p>
                <div className="zen-card-steps">
                  <p>01 Inhale for 4 seconds.</p>
                  <p>02 Hold for 7 seconds.</p>
                  <p>03 Exhale for 8 seconds.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-shell">
        <header className="navbar">
          <div className="navbar-main">
            <Link to="/" className="brand">Inner Balance</Link>

            <div className="menu-items">
              <DropdownMenu title="Experts" items={menuData.experts} type="icons" />
              <DropdownMenu title="Clinics" items={[
                { name: "Find a Clinic", link: "#" },
                { name: "Clinic Directory", link: "#" },
                { name: "Telemedicine", link: "#" }
              ]} type="list" />
              <DropdownMenu title="Services" items={menuData.services} type="icons" />
              <DropdownMenu title="Conditions" items={menuData.conditions} type="list" />
              <DropdownMenu title="Resources" items={menuData.resources} type="list" />
              <DropdownMenu title="Get Started" items={[
                { name: "Sign up", link: "/signup" },
                { name: "Log in", link: "/login" }
              ]} type="list" menuClass="get-started" />
              <DropdownMenu title="For Partners" items={[
                { name: "Partner Program", link: "#" },
                { name: "Become a Provider", link: "#" },
                { name: "API Documentation", link: "#" }
              ]} type="list" />
              <DropdownMenu title="About Us" items={[
                { name: "Our Mission", link: "#" },
                { name: "Our Team", link: "#" },
                { name: "Contact Us", link: "#" },
                { name: "Privacy Policy", link: "#" }
              ]} type="list" />
            </div>

            <div className="header-actions">
              <button
                type="button"
                className="icon-btn theme-toggle"
                onClick={() => setDarkMode((prev) => !prev)}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button type="button" className="btn btn-white zen-toggle" onClick={() => setZenMode(true)}>
                <Sparkles size={16} /> Zen Mode
              </button>
              <a href="tel:+918309873555" className="icon-btn phone-btn" aria-label="Call us" title="Call: 8309873555">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </a>
              <a href="https://wa.me/918309873555" target="_blank" rel="noreferrer" className="icon-btn whatsapp-btn" aria-label="WhatsApp us" title="WhatsApp: 8309873555">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.981 1.429 9.86 9.86 0 001.414 19.209h.004c2.782 0 5.404-1.087 7.202-3.051a9.875 9.875 0 00-3.635-17.587z"/>
                </svg>
              </a>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary header-cta">Dashboard</Link>
                  <button type="button" className="btn btn-secondary header-cta" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary header-cta">Log in</Link>
              )}
            </div>
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/chat" element={<RequireAuth><Chatbot /></RequireAuth>} />
            <Route path="/mood-tracker" element={<RequireAuth><MoodTracker /></RequireAuth>} />
            <Route path="/wellness" element={<RequireAuth><Wellness /></RequireAuth>} />
            <Route path="/resources" element={<RequireAuth><Resources /></RequireAuth>} />
            <Route
              path="*"
              element={
                <div className="error-page">
                  <div className="error-content">
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                    <Link to="/" className="btn btn-primary">← Go Home</Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Company</h4>
              <Link to="/">About Us</Link>
              <Link to="/">Our Vision</Link>
              <Link to="/">Leadership</Link>
              <Link to="/">Contact</Link>
            </div>

            <div className="footer-section">
              <h4>Resources</h4>
              <Link to="/">Library</Link>
              <Link to="/chat">Chat Support</Link>
              <Link to="/wellness">Wellness Tools</Link>
              <Link to="/resources">Resources</Link>
            </div>

            <div className="footer-section">
              <h4>Community</h4>
              <Link to="/chat">Find Support</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/mood-tracker">Mood Tracker</Link>
              <Link to="/signup">Join Us</Link>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <Link to="/">Terms of Use</Link>
              <Link to="/">Privacy Policy</Link>
              <Link to="/">Cookie Policy</Link>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2024 Inner Balance. All Rights Reserved. | Transforming Mental Wellness</p>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </footer>

        <EmergencyHelp isVisible={false} onClose={() => {}} />
      </div>
    </Router>
  );
}

export default App;