// Emotion Detection System using Gemini AI
class EmotionDetector {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.emotionKeywords = {
      happy: ['happy', 'glad', 'joyful', 'excited', 'love', 'great', 'wonderful', 'amazing', 'fantastic', 'excellent'],
      sad: ['sad', 'depressed', 'unhappy', 'miserable', 'down', 'broken', 'crying', 'tears', 'lonely', 'empty'],
      anxious: ['anxious', 'worried', 'nervous', 'stressed', 'panic', 'afraid', 'scared', 'overwhelming', 'tension', 'overwhelmed'],
      angry: ['angry', 'furious', 'mad', 'irritated', 'frustrated', 'outraged', 'enraged', 'livid', 'resentful', 'hostile'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'chill', 'at ease', 'composed', 'centered', 'balanced'],
      confused: ['confused', 'lost', 'bewildered', 'uncertain', 'unsure', 'unclear', 'puzzled', 'disoriented', 'muddled', 'foggy'],
      grateful: ['grateful', 'thankful', 'appreciate', 'blessed', 'fortunate', 'grateful', 'gratitude', 'honored', 'privileged'],
      hopeful: ['hopeful', 'optimistic', 'believe', 'possibility', 'future', 'potential', 'inspired', 'motivated', 'confident'],
    };

    this.emotionEmojis = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      angry: '😠',
      calm: '😌',
      confused: '😕',
      grateful: '🙏',
      hopeful: '😌',
      neutral: '😶',
    };

    this.emotionColors = {
      happy: '#FFD700',
      sad: '#4B0082',
      anxious: '#FF6347',
      angry: '#DC143C',
      calm: '#87CEEB',
      confused: '#808080',
      grateful: '#32CD32',
      hopeful: '#FF69B4',
      neutral: '#A9A9A9',
    };
  }

  // Detect emotions from user message locally first
  detectEmotionsLocal(message) {
    const lowerMessage = message.toLowerCase();
    const detected = {};
    let maxScore = 0;
    let primaryEmotion = 'neutral';

    for (const [emotion, keywords] of Object.entries(this.emotionKeywords)) {
      let score = 0;
      keywords.forEach((keyword) => {
        if (lowerMessage.includes(keyword)) {
          score += 1;
        }
      });

      if (score > 0) {
        detected[emotion] = score;
        if (score > maxScore) {
          maxScore = score;
          primaryEmotion = emotion;
        }
      }
    }

    return {
      primary: primaryEmotion,
      detected,
      confidence: maxScore > 0 ? Math.min(1, maxScore / 3) : 0,
      emoji: this.emotionEmojis[primaryEmotion],
      color: this.emotionColors[primaryEmotion],
    };
  }

  // Use Gemini AI for deeper emotion analysis
  async detectEmotionsAI(message) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Analyze the emotions in this message. Return ONLY a JSON object with: primary_emotion (string), confidence (0-1), detected_emotions (array), reasoning (string). Message: "${message}"`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) throw new Error('AI analysis failed');

      const data = await response.json();
      const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysis) return this.detectEmotionsLocal(message);

      try {
        const parsed = JSON.parse(analysis);
        const emotion = parsed.primary_emotion?.toLowerCase() || 'neutral';

        return {
          primary: emotion,
          confidence: parsed.confidence || 0.7,
          detected: Array.isArray(parsed.detected_emotions) ? parsed.detected_emotions : [],
          reasoning: parsed.reasoning || '',
          emoji: this.emotionEmojis[emotion] || '😶',
          color: this.emotionColors[emotion] || '#A9A9A9',
        };
      } catch {
        return this.detectEmotionsLocal(message);
      }
    } catch (error) {
      console.error('Emotion AI detection failed:', error);
      return this.detectEmotionsLocal(message);
    }
  }

  // Analyze emotions over time
  analyzeEmotionTrends(messages) {
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        total: 0,
        primary: { emotion: 'neutral' },
        allEmotions: [],
        timeline: []
      };
    }

    const emotions = messages.map((msg) => this.detectEmotionsLocal(msg.text || ''));
    const emotionCounts = {};

    emotions.forEach((e) => {
      emotionCounts[e.primary] = (emotionCounts[e.primary] || 0) + 1;
    });

    const sortedEmotions = Object.entries(emotionCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([emotion, count]) => ({
        emotion,
        count,
        percentage: ((count / emotions.length) * 100).toFixed(1),
        emoji: this.emotionEmojis[emotion],
        color: this.emotionColors[emotion],
      }));

    return {
      total: emotions.length,
      primary: sortedEmotions[0],
      allEmotions: sortedEmotions,
      timeline: emotions,
    };
  }

  // Get emotion health score (0-100)
  getEmotionHealthScore(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return 50;

    const analysis = this.analyzeEmotionTrends(messages);
    const primaryEmotion = analysis?.primary?.emotion || 'neutral';

    // Positive emotions boost score
    const positiveEmotions = ['happy', 'calm', 'grateful', 'hopeful'];
    const negativeEmotions = ['sad', 'anxious', 'angry'];

    let score = 50;
    if (positiveEmotions.includes(primaryEmotion)) score += 20;
    if (negativeEmotions.includes(primaryEmotion)) score -= 20;

    return Math.max(0, Math.min(100, score));
  }
}

export default EmotionDetector;