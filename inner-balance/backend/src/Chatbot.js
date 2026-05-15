import React, { useState, useEffect, useRef } from "react";
import EmotionDetector from "./utils/emotionDetector";

function Chatbot() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [{ text: "Hi! How are you feeling today? I’m here to listen.", sender: "bot", id: 1 }];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [emotionDetector] = useState(() => new EmotionDetector(process.env.REACT_APP_GEMINI_API_KEY));
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Detect emotion in user message
    const emotionAnalysis = await emotionDetector.detectEmotionsAI(input);

    const userMessage = {
      text: input,
      sender: "user",
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      emotion: emotionAnalysis,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("API key not configured. Please set REACT_APP_GEMINI_API_KEY in .env.local");
      }

      // Enhanced prompt with emotion context
      const emotionContext = `The user seems to be feeling ${emotionAnalysis.primary} ${emotionAnalysis.emoji}.
      Confidence: ${Math.round(emotionAnalysis.confidence * 100)}%.
      Please respond empathetically and provide relevant support.`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a compassionate mental health support chatbot. Your role is to listen, validate feelings, and provide helpful advice. Be warm, empathetic, and supportive.

Emotion Context: ${emotionContext}

User message: ${input}

Respond in a way that acknowledges their emotional state and provides appropriate support.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || `Server error: ${response.status}`
        );
      }

      const data = await response.json();
      const botText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm here to help. Tell me more about what you're feeling.";

      const botMessage = {
        text: botText,
        sender: "bot",
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat Error:", error);

      const errorMessage = {
        text: `Sorry, I encountered an error: ${error.message}. Please check your API key configuration. For now, remember you are not alone and it is okay to reach out.`,
        sender: "bot",
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Clear all chat history?")) {
      setMessages([
        {
          text: "Hi! How are you feeling today? I'm here to listen. 💙",
          sender: "bot",
          id: 1,
        },
      ]);
      localStorage.removeItem("chatHistory");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chatbot-page container slide-in">
      <div className="chat-header glass-card">
        <h1>Mental Health Assistant</h1>
        <p>A confidential space to talk about your feelings</p>
        <div className="emotion-stats">
          {messages.length > 1 && (
            <div className="emotion-summary">
              {(() => {
                const userMessages = messages.filter(m => m.sender === 'user' && m.emotion);
                if (userMessages.length > 0) {
                  const analysis = emotionDetector.analyzeEmotionTrends(userMessages);
                  return (
                    <div className="emotion-badge">
                      <span className="emotion-emoji">{analysis.primary.emoji}</span>
                      <span>Primary emotion: {analysis.primary.emotion}</span>
                      <span>({analysis.primary.percentage}% of messages)</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>
      </div>

      <div className="chat-container glass-card">
        <div className="chatbox">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`chat-message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}
            >
              <div className="message-content">
                {msg.text}
                {msg.emotion && msg.sender === "user" && (
                  <div className="emotion-tag" style={{ backgroundColor: msg.emotion.color + '40', color: msg.emotion.color }}>
                    {msg.emotion.emoji} {msg.emotion.primary}
                  </div>
                )}
              </div>
              {msg.timestamp && (
                <span className="message-time">{msg.timestamp}</span>
              )}
            </div>
          ))}
          {loading && (
            <div className="chat-message bot-msg">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            className="chat-input"
            placeholder="Type your message... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <div className="chat-actions">
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={clearHistory}
              title="Clear chat history"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="chat-tips glass-card">
        <h3>Tips for better support</h3>
        <ul>
          <li>Be honest about how you are feeling</li>
          <li>Share specific situations or concerns</li>
          <li>Ask for coping strategies when you need them</li>
          <li>Remember: This is a supportive tool, not a replacement for professional help</li>
        </ul>
      </div>
    </div>
  );
}

export default Chatbot;