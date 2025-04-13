# Video Tracker App

A full-stack video tracking application that monitors how much of a video a user has watched, tracks unique watched intervals, stores progress in MongoDB, and resumes playback from the last position.

# Features

- Track unique watched video intervals
- Resume from last watched position
- Store video progress in MongoDB
- Intelligent interval merging
- rontend built with React.js
- Backend powered by Node.js and Express


# Backend Setup (`server`)

1. Navigate to the backend folder:
   
     cd server

3. Install backend dependencies:

     npm install

4. Create a .env file in the server/ folder and add:

     MONGO_URI=your_mongodb_connection_string
     PORT=3000

5. Start the backend server:

     npm start

# Frontend Setup (`client`)

1. Navigate to the client folder:

   cd client
   
2. Install frontend dependencies:

   npm install
   
3. Start the React app:

      npm start
   
React app runs at: http://localhost:3000



# Design Decisions & Code Explanation

# Tech Stack
   Frontend: React.js for building responsive UI and managing state

   Backend: Node.js + Express.js for creating RESTful APIs

   Database: MongoDB to store video progress as flexible JSON-like documents

# App Structure
   client/: React app with video player and API calls to backend

   server/: Express API that handles storing and retrieving progress

   MongoDB used to persist watched intervals and last watched time

# Key Logic
   Watched Interval Tracking:

   Intervals are stored as [start, end] arrays.

   On each update, overlapping intervals are merged.

   Duplicate segments aren’t double-counted.

# Resume Logic:

   When the video loads, the app fetches the last watched position from MongoDB and sets it in the player.

# Frontend:

   Uses useEffect to trigger saving progress when the video is paused or closed.

   Axios is used to communicate with the backend.

# Backend:

   Receives video progress via POST /api/video-progress

   Uses MongoDB update queries to merge and save data.
