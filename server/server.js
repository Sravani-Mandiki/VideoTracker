// Load environment variables
require('dotenv').config();

const progressRoutes = require('./routes/progressRoutes');


// Import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create express app
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://video-tracker-w919.vercel.app'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.use('/api', progressRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("MongoDB connection error:", err));

// Sample route
app.get('/', (req, res) => {
  res.send('Video Tracker API is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
