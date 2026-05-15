require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const MoodEntry = require('./models/MoodEntry');
const Appointment = require('./models/Appointment');
const auth = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, ...additionalFields } = req.body;

    // Validate role
    if (!['client', 'psychiatrist'].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be 'client' or 'psychiatrist'" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      ...additionalFields
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET USER PROFILE (Protected route)
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE USER PROFILE (Protected route)
app.put("/profile", auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password update here
    delete updates.email; // Email changes might need verification

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: user.toObject({ getters: true })
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// MOOD TRACKING ROUTES

// POST /mood - Save a mood entry
app.post("/mood", auth, async (req, res) => {
  try {
    const { mood, value, notes } = req.body;

    if (!mood || !value) {
      return res.status(400).json({ message: "Mood and value are required" });
    }

    const moodEntry = new MoodEntry({
      userId: req.user.userId,
      mood,
      value,
      notes
    });

    await moodEntry.save();

    res.status(201).json({
      message: "Mood entry saved successfully",
      moodEntry
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /mood - Get user's mood entries
app.get("/mood", auth, async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const moodEntries = await MoodEntry.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json({ moodEntries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// APPOINTMENT ROUTES

// POST /appointments - Book an appointment
app.post("/appointments", auth, async (req, res) => {
  try {
    const { psychiatristId, date, startTime, endTime, notes } = req.body;

    if (!psychiatristId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if psychiatrist exists and is a psychiatrist
    const psychiatrist = await User.findById(psychiatristId);
    if (!psychiatrist || psychiatrist.role !== 'psychiatrist') {
      return res.status(400).json({ message: "Invalid psychiatrist" });
    }

    const appointment = new Appointment({
      clientId: req.user.userId,
      psychiatristId,
      date,
      startTime,
      endTime,
      notes
    });

    await appointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /appointments - Get user's appointments
app.get("/appointments", auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'client') {
      query.clientId = req.user.userId;
    } else if (req.user.role === 'psychiatrist') {
      query.psychiatristId = req.user.userId;
    }

    const appointments = await Appointment.find(query)
      .populate('clientId', 'name email')
      .populate('psychiatristId', 'name email specialization')
      .sort({ date: 1 });

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /psychiatrists - Get list of psychiatrists
app.get("/psychiatrists", auth, async (req, res) => {
  try {
    const psychiatrists = await User.find({ role: 'psychiatrist' })
      .select('name email specialization experienceYears bio availability')
      .sort({ name: 1 });

    res.json({ psychiatrists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});