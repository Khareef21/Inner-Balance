import React from "react";

function Wellness() {
  const guides = [
    {
      id: 1,
      title: "5-Minute Breathing Exercise",
      emoji: "🫁",
      description:
        "A simple breathing technique to calm your nervous system instantly.",
      steps: [
        "Breathe in for 4 seconds",
        "Hold for 4 seconds",
        "Breathe out for 4 seconds",
        "Repeat 10 times",
      ],
    },
    {
      id: 2,
      title: "Grounding Technique (5-4-3-2-1)",
      emoji: "🌍",
      description:
        "Use your senses to anchor yourself to the present moment when anxious.",
      steps: [
        "Notice 5 things you can see",
        "4 things you can touch",
        "3 things you can hear",
        "2 things you can smell",
        "1 thing you can taste",
      ],
    },
    {
      id: 3,
      title: "Body Scan Meditation",
      emoji: "🧘",
      description:
        "Relax your body by focusing on each part from head to toe.",
      steps: [
        "Find a quiet space",
        "Close your eyes",
        "Slowly scan from your head down",
        "Notice and release any tension",
        "Spend 2-3 minutes total",
      ],
    },
    {
      id: 4,
      title: "Positive Affirmations",
      emoji: "✨",
      description: "Boost self-confidence with daily positive statements.",
      steps: [
        "I am worthy and strong",
        "My challenges help me grow",
        "I deserve happiness and peace",
        "I am doing my best",
        "Repeat each morning",
      ],
    },
  ];

  return (
    <div className="wellness-page">
      <div className="wellness-header">
        <h1>🧘 Wellness & Mindfulness</h1>
        <p>Explore guided exercises to improve your mental health</p>
      </div>

      <div className="guides-container">
        {guides.map((guide) => (
          <div key={guide.id} className="guide-card">
            <div className="guide-emoji">{guide.emoji}</div>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
            <div className="guide-steps">
              <h4>How to:</h4>
              <ol>
                {guide.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Wellness;
