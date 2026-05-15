import React, { useState } from "react";

function Resources() {
  const [activeCategory, setActiveCategory] = useState("All");

  const resources = [
    {
      id: 1,
      category: "Hotlines",
      emoji: "📞",
      items: [
        { name: "National Suicide Prevention Lifeline", desc: "1-800-273-8255", color: "#e74c3c" },
        { name: "Crisis Text Line", desc: "Text HOME to 741741", color: "#e74c3c" },
        { name: "NAMI Helpline", desc: "1-800-950-NAMI", color: "#3498db" },
      ],
    },
    {
      id: 2,
      category: "Meditation",
      emoji: "🧘",
      items: [
        { name: "Calm", desc: "Sleep, meditation, and mindfulness app", color: "#9b59b6" },
        { name: "Headspace", desc: "Mental fitness made simple", color: "#2ecc71" },
        { name: "Insight Timer", desc: "Free meditation and sleep app", color: "#f39c12" },
      ],
    },
    {
      id: 3,
      category: "Education",
      emoji: "📚",
      items: [
        { name: "Mind.org.uk", desc: "Information about mental illness", color: "#3498db" },
        { name: "NAMI.org", desc: "Peer support and education", color: "#2ecc71" },
        { name: "Rethink Mental Illness", desc: "Support for serious mental illness", color: "#9b59b6" },
      ],
    },
    {
      id: 4,
      category: "Coping",
      emoji: "💪",
      items: [
        { name: "Journaling", desc: "Write your thoughts and feelings", color: "#e74c3c" },
        { name: "Exercise", desc: "Physical activity boosts mental health", color: "#2ecc71" },
        { name: "Social Connection", desc: "Reach out to friends and family", color: "#3498db" },
      ],
    },
  ];

  const categories = ["All", "Hotlines", "Meditation", "Education", "Coping"];
  const filteredResources = activeCategory === "All"
    ? resources
    : resources.filter((resource) => resource.category === activeCategory);

  return (
    <div className="resources-page">
      <div className="resources-header">
        <div>
          <span className="section-label">Student Wellness Toolkit</span>
          <h1>Curated Resources for your growth</h1>
          <p>Access expert-backed support materials once you're signed in.</p>
        </div>
        <div className="resource-chips">
          {categories.map((category) => (
            <button
              key={category}
              className={`chip ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="resources-container">
        {filteredResources.map((category) => (
          <div key={category.id} className="resource-category">
            <div className="resource-category-header">
              <span className="resource-emoji">{category.emoji}</span>
              <div>
                <h2>{category.category}</h2>
                <p>Essential tools, guides, and support for {category.category.toLowerCase()}.</p>
              </div>
            </div>
            <div className="resource-items">
              {category.items.map((item, idx) => (
                <div key={idx} className="resource-item" style={{ borderLeft: `4px solid ${item.color}` }}>
                  <div className="resource-item-title">{item.name}</div>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="resources-tips">
        <h2>How to get the most from these tools</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <p>✅ Bookmark top resources and revisit them on your dashboard.</p>
          </div>
          <div className="tip-card">
            <p>✅ Use guided breathing or meditation whenever you feel overwhelmed.</p>
          </div>
          <div className="tip-card">
            <p>✅ Track mood patterns and connect with support when needed.</p>
          </div>
          <div className="tip-card">
            <p>✅ Share resources with friends or study groups for peer support.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
