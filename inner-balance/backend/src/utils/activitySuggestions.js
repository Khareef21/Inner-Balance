// Smart Activity Suggestion System
class ActivitySuggestions {
  constructor() {
    this.activities = {
      happy: [
        { title: 'Share your joy', desc: 'Call a friend or loved one', category: 'social', duration: 15 },
        { title: 'Dance it out', desc: 'Dance to your favorite music', category: 'movement', duration: 10 },
        { title: 'Write in journal', desc: 'Document your happy moments', category: 'reflection', duration: 10 },
        { title: 'Create something', desc: 'Paint, draw, or craft', category: 'creative', duration: 30 },
        { title: 'Volunteer', desc: 'Help someone in need', category: 'social', duration: 60 },
      ],
      sad: [
        { title: 'Reach out', desc: 'Connect with someone who cares', category: 'social', duration: 15 },
        { title: 'Walk in nature', desc: 'Take a walk in fresh air', category: 'movement', duration: 20 },
        { title: 'Write feelings', desc: 'Journal your emotions', category: 'reflection', duration: 15 },
        { title: 'Watch comfort show', desc: 'Watch something uplifting', category: 'entertainment', duration: 30 },
        { title: 'Self-care routine', desc: 'Bath, skincare, cozy time', category: 'selfcare', duration: 30 },
        { title: 'Listen to music', desc: 'Play uplifting songs', category: 'entertainment', duration: 15 },
      ],
      anxious: [
        { title: 'Breathe deeply', desc: '4-7-8 breathing technique', category: 'meditation', duration: 5 },
        { title: 'Progressive muscle relaxation', desc: 'Tense and release muscles', category: 'relaxation', duration: 15 },
        { title: 'Ground yourself', desc: '5 senses grounding exercise', category: 'mindfulness', duration: 5 },
        { title: 'Gentle yoga', desc: 'Easy stretching and poses', category: 'movement', duration: 20 },
        { title: 'Meditate', desc: 'Guided meditation session', category: 'meditation', duration: 10 },
        { title: 'Organize space', desc: 'Tidy or organize one area', category: 'activity', duration: 30 },
      ],
      angry: [
        { title: 'Physical exercise', desc: 'Run, climb, or intense workout', category: 'movement', duration: 30 },
        { title: 'Express safely', desc: 'Write angry letters (don\'t send)', category: 'reflection', duration: 15 },
        { title: 'Ice bath challenge', desc: 'Cool off with cold water', category: 'activity', duration: 5 },
        { title: 'Scream into pillow', desc: 'Release frustration safely', category: 'activity', duration: 2 },
        { title: 'Hit a pillow', desc: 'Physical release of tension', category: 'movement', duration: 5 },
        { title: 'Cool down walk', desc: 'Slow, mindful walk', category: 'movement', duration: 15 },
      ],
      calm: [
        { title: 'Maintain this state', desc: 'Avoid disruptions', category: 'mindfulness', duration: 5 },
        { title: 'Guided meditation', desc: 'Deepen your peace', category: 'meditation', duration: 20 },
        { title: 'Read something peaceful', desc: 'Inspiring or peaceful reading', category: 'entertainment', duration: 30 },
        { title: 'Creative work', desc: 'Paint, write, or create', category: 'creative', duration: 45 },
        { title: 'Spend time in nature', desc: 'Garden, walk, or sit outside', category: 'movement', duration: 30 },
      ],
      confused: [
        { title: 'Clarify thoughts', desc: 'Write down thoughts clearly', category: 'reflection', duration: 15 },
        { title: 'Talk it out', desc: 'Discuss with someone', category: 'social', duration: 20 },
        { title: 'Change perspective', desc: 'Take a break and return', category: 'mindfulness', duration: 30 },
        { title: 'List pros and cons', desc: 'Organize your concerns', category: 'reflection', duration: 10 },
        { title: 'Meditate', desc: 'Clear your mind', category: 'meditation', duration: 15 },
      ],
      grateful: [
        { title: 'Thank you message', desc: 'Thank someone important', category: 'social', duration: 10 },
        { title: 'Gratitude journal', desc: 'Write 3 things you\'re grateful for', category: 'reflection', duration: 10 },
        { title: 'Pay it forward', desc: 'Help someone else', category: 'social', duration: 30 },
        { title: 'Share appreciation', desc: 'Tell someone you care', category: 'social', duration: 15 },
      ],
      hopeful: [
        { title: 'Set a goal', desc: 'Define your next step', category: 'reflection', duration: 20 },
        { title: 'Plan something fun', desc: 'Schedule something to look forward to', category: 'activity', duration: 15 },
        { title: 'Vision board', desc: 'Create or update your vision', category: 'creative', duration: 45 },
        { title: 'Learn something new', desc: 'Start a course or skill', category: 'learning', duration: 30 },
      ],
    };
  }

  // Get suggestions based on emotion and context
  getSuggestions(emotion, context = {}) {
    const baseActivities = this.activities[emotion] || this.activities.calm;

    // Filter by time available
    let filtered = baseActivities;
    if (context.timeAvailable) {
      filtered = baseActivities.filter((a) => a.duration <= context.timeAvailable);
    }

    // Filter by preferred categories
    if (context.preferredCategories && context.preferredCategories.length > 0) {
      filtered = filtered.filter((a) => context.preferredCategories.includes(a.category));
    }

    // Return shuffled suggestions
    return this.shuffleArray(filtered).slice(0, 5);
  }

  // Get personalized suggestions based on user history
  getPersonalizedSuggestions(userHistory, currentEmotion) {
    const suggestions = this.getSuggestions(currentEmotion);

    // Analyze what worked before
    const effectiveActivities = {};
    userHistory.forEach((entry) => {
      if (entry.activity && entry.mood_after > entry.mood_before) {
        effectiveActivities[entry.activity] = (effectiveActivities[entry.activity] || 0) + 1;
      }
    });

    // Prioritize activities that helped before
    suggestions.sort((a, b) => {
      const aScore = effectiveActivities[a.title] || 0;
      const bScore = effectiveActivities[b.title] || 0;
      return bScore - aScore;
    });

    return suggestions;
  }

  // Get activity effectiveness rating
  getActivityEffectiveness(userHistory) {
    const effectiveness = {};

    userHistory.forEach((entry) => {
      if (entry.activity) {
        if (!effectiveness[entry.activity]) {
          effectiveness[entry.activity] = { count: 0, avgImprovement: 0 };
        }
        effectiveness[entry.activity].count += 1;
        effectiveness[entry.activity].avgImprovement += entry.mood_after - entry.mood_before;
      }
    });

    Object.keys(effectiveness).forEach((key) => {
      effectiveness[key].avgImprovement /= effectiveness[key].count;
    });

    return effectiveness;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export default ActivitySuggestions;