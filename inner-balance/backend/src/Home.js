import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Home() {
  const [email, setEmail] = useState("");

  // Testimonials
  const testimonials = [
    {
      name: "Sarah M.",
      role: "User",
      quote: "Inner Balance helped me manage my anxiety in ways I never thought possible.",
      image: "author-1"
    },
    {
      name: "James K.",
      role: "User",
      quote: "The mood tracking feature gave me insights into my emotional patterns.",
      image: "author-2"
    },
    {
      name: "Emma L.",
      role: "User",
      quote: "Finally found a mental health platform that actually understands me.",
      image: "author-3"
    }
  ];

  // Trending searches
  const trendingSearches = [
    "Anxiety Management",
    "Depression Support",
    "Stress Relief",
    "Sleep Problems",
    "Relationships & Trust",
    "Self-Esteem",
    "Mindfulness",
    "Therapy Options"
  ];

  // Articles / Library
  const libraryArticles = [
    {
      id: 1,
      category: "Mental Wellness",
      title: "Understanding Your Emotions: A Guide to Emotional Intelligence",
      author: "Dr. Sarah Chen",
      image: "article-1",
      excerpt: "Learn how emotional intelligence can transform your mental health journey..."
    },
    {
      id: 2,
      category: "Wellness",
      title: "5 Daily Practices for Mental Wellness",
      author: "Emma Johnson",
      image: "article-2",
      excerpt: "Simple yet powerful techniques you can implement every day..."
    },
    {
      id: 3,
      category: "Mental Health",
      title: "Breaking the Stigma: Mental Health in the Workplace",
      author: "Dr. Michael Rodriguez",
      image: "article-3",
      excerpt: "Creating supportive environments where mental health matters..."
    },
    {
      id: 4,
      category: "Recovery",
      title: "Building Resilience: Bouncing Back from Setbacks",
      author: "Lisa Anderson",
      image: "article-4",
      excerpt: "Develop inner strength and resilience to overcome challenges..."
    }
  ];

  // Q&A
  const qaItems = [
    {
      question: "How do I know if I need therapy?",
      answer: "If you're experiencing persistent emotional distress that affects your daily life, therapy can be beneficial.",
      author: "Dr. James Wilson",
      role: "Clinical Psychologist"
    },
    {
      question: "What's the difference between anxiety and stress?",
      answer: "While stress is a response to a threat, anxiety is a reaction to stress that persists even when the threat is gone.",
      author: "Dr. Amy Lee",
      role: "Psychiatrist"
    },
    {
      question: "Can I manage depression without medication?",
      answer: "While therapy and lifestyle changes can help, professional evaluation is crucial for proper treatment planning.",
      author: "Dr. Robert Taylor",
      role: "Clinical Director"
    }
  ];

  // Wellness Tools
  const tools = [
    {
      icon: "🧘",
      title: "Guided Meditation",
      description: "Access calming meditation sessions for daily peace"
    },
    {
      icon: "📝",
      title: "Mood Journal",
      description: "Track your emotions and identify patterns over time"
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      description: "Create and track meaningful personal wellness goals"
    },
    {
      icon: "💬",
      title: "Chat Support",
      description: "Connect with supportive community members anytime"
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description: "Visualize your mental health journey and improvements"
    },
    {
      icon: "🎵",
      title: "Relaxation Music",
      description: "Curated playlists designed to reduce stress and anxiety"
    }
  ];

  // Professionals
  const professionals = [
    {
      name: "Dr. Sarah Anderson",
      title: "Clinical Psychologist",
      specialty: "Anxiety & Depression",
      image: "👩‍⚕️",
      bio: "With 15+ years of experience, specializing in cognitive behavioral therapy..."
    },
    {
      name: "Dr. Michael Roberts",
      title: "Licensed Therapist",
      specialty: "Trauma & PTSD",
      image: "👨‍⚕️",
      bio: "Compassionate therapist dedicated to trauma-informed care..."
    },
    {
      name: "Dr. Emily Watson",
      title: "Counselor",
      specialty: "Relationship Counseling",
      image: "👩‍⚖️",
      bio: "Helping couples and individuals build healthy relationships..."
    }
  ];

  // Blog Articles
  const blogArticles = [
    {
      id: 1,
      title: "The Impact of Social Media on Mental Health",
      author: "Dr. James Wilson",
      date: "April 10, 2024",
      image: "📱"
    },
    {
      id: 2,
      title: "Creating a Mental Health Emergency Plan",
      author: "Sarah Chen",
      date: "April 8, 2024",
      image: "🚨"
    },
    {
      id: 3,
      title: "Workplace Mental Health: A Corporate Guide",
      author: "Michael Roberts",
      date: "April 5, 2024",
      image: "🏢"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${email}`);
    setEmail("");
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Prioritize Your Mental Health</h1>
          <p>Transform your mental wellness journey with Inner Balance</p>
          <p className="hero-subtext">Comprehensive resources, community support, and professional guidance all in one platform.</p>
          <div className="hero-badges">
            <span>Trusted by learners worldwide</span>
            <span>Personalized wellness journeys</span>
            <span>24/7 wellbeing support</span>
          </div>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link to="/mood-tracker" className="btn btn-white btn-lg">Mood Journal</Link>
          </div>
        </div>
      </section>

      {/* TRENDING SEARCHES */}
      <section className="trending-section">
        <div className="container">
          <h2>Trending Topics</h2>
          <div className="trending-grid">
            {trendingSearches.map((search, idx) => (
              <Link key={idx} to={`/resources?search=${search}`} className="trending-tag">
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS / COMMUNITY CONNECTIONS */}
      <section className="testimonials-section">
        <div className="container">
          <h2>Community Connections</h2>
          <p className="section-subtitle">Real stories from our community members</p>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="testimonial-card">
                <div className={`testimonial-icon ${testimonial.image}`}>{testimonial.name.charAt(0)}</div>
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <p className="testimonial-author">{testimonial.name}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MENTAL HEALTH LIBRARY */}
      <section className="library-section">
        <div className="container">
          <h2>Mental Health Library</h2>
          <p className="section-subtitle">Explore our comprehensive guide to mental wellness</p>
          <div className="library-cards">
            {libraryArticles.map((article) => (
              <div key={article.id} className="library-card">
                <div className={`library-icon ${article.image}`}></div>
                <span className="library-category">{article.category}</span>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
                <p className="library-author">By {article.author}</p>
                <Link to="/resources" className="read-more">Read More →</Link>
              </div>
            ))}
          </div>
          <Link to="/resources" className="view-all-link">View Full Library →</Link>
        </div>
      </section>

      {/* Q&A SECTION */}
      <section className="qa-section">
        <div className="container">
          <h2>Mental Health Answers</h2>
          <p className="section-subtitle">Get expert answers to your mental health questions</p>
          <div className="qa-cards">
            {qaItems.map((item, idx) => (
              <div key={idx} className="qa-card">
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
                <div className="qa-author">
                  <span className="author-name">{item.author}</span>
                  <span className="author-role">{item.role}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/chat" className="view-all-link">Ask More Questions →</Link>
        </div>
      </section>

      {/* WELLNESS TOOLS */}
      <section className="tools-section">
        <div className="container">
          <h2>Wellness Tools</h2>
          <p className="section-subtitle">Discover tools designed to support your well-being</p>
          <div className="tools-grid">
            {tools.map((tool, idx) => (
              <div key={idx} className="tool-card">
                <div className="tool-icon">{tool.icon}</div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
          <Link to="/wellness" className="view-all-link">Explore All Tools →</Link>
        </div>
      </section>

      {/* PROFESSIONALS NETWORK */}
      <section className="professionals-section">
        <div className="container">
          <h2>Professional Network</h2>
          <p className="section-subtitle">Connect with experienced mental health professionals</p>
          <div className="professionals-grid">
            {professionals.map((pro, idx) => (
              <div key={idx} className="professional-card">
                <div className="professional-icon">{pro.image}</div>
                <h3>{pro.name}</h3>
                <p className="professional-title">{pro.title}</p>
                <p className="professional-specialty">{pro.specialty}</p>
                <p className="professional-bio">{pro.bio}</p>
                <Link to="/chat" className="btn btn-sm">Connect</Link>
              </div>
            ))}
          </div>
          <Link to="/resources" className="view-all-link">View All Professionals →</Link>
        </div>
      </section>

      {/* BLOG / GENUINE PERSPECTIVE */}
      <section className="blog-section">
        <div className="container">
          <h2>Genuine Perspectives</h2>
          <p className="section-subtitle">Stay informed with insights from our experts</p>
          <div className="blog-cards">
            {blogArticles.map((article) => (
              <div key={article.id} className="blog-card">
                <div className="blog-icon">{article.image}</div>
                <h3>{article.title}</h3>
                <p className="blog-meta">{article.author} • {article.date}</p>
                <Link to="/resources" className="read-more">Read Article →</Link>
              </div>
            ))}
          </div>
          <Link to="/resources" className="view-all-link">View All Articles →</Link>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="newsletter-section">
        <div className="container newsletter-container">
          <div className="newsletter-content">
            <h2>Get Mental Health Support</h2>
            <p>Reclaim your well-being. Subscribe to our newsletter for tips, resources, and support.</p>
            
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-white">Subscribe</button>
            </form>
            
            <p className="newsletter-privacy">✓ No spam, just helpful content</p>
          </div>
          
          <div className="newsletter-image">
            <div className="newsletter-icon">🧠</div>
          </div>
        </div>
      </section>

      {/* COMPANY OVERVIEW / CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Mental Health?</h2>
            <p>Join thousands of users who are already taking control of their mental wellness.</p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">Create Your Account</Link>
              <Link to="/resources" className="btn btn-outline btn-lg">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
