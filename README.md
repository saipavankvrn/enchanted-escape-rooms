# The Shadow's House - Cybersecurity Escape Room

Welcome to **The Shadow's House**, an immersive CTF (Capture The Flag) style escape room game designed to test and train your cybersecurity skills.

## 🕵️ Mission Briefing
You are an operative for **CONCLAVE**. Your objective is to infiltrate the digital fortress known as "The Shadow's House" and recover critical data fragments. The system is guarded by 5 layers of security, each requiring a different set of hacking skills to bypass.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally or accessible via connection string)

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    - Ensure your MongoDB instance is running.
    - Check `.env` (or create one) for specific configuration if needed (e.g., `MONGODB_URI`).

### Running the Application

This project consists of a React frontend and a Node.js/Express backend.

1.  **Start the Backend Server**:
    ```bash
    npm run start:server
    ```
    *The server runs on port 5000 by default.*

2.  **Start the Frontend Development Server**:
    ```bash
    npm run dev
    ```
    *The application will be accessible at `http://localhost:8080` (or the port shown in your terminal).*

## 🎮 Gameplay Overview

The game is divided into 5 Levels. You have **50 minutes** to complete all challenges.

### Level 1: The Whispering Porch
A test of vigilance and intuition. Can you distinguish between friend and foe in the digital mist?

### Level 2: The Hall of Mirrors
Nothing is as it seems. Use your investigative skills to find the truth hidden behind layers of deception.

### Level 3: Targeted Penetration
A challenge of persistence. Breach the barriers by uncovering the patterns hidden in plain sight.

### Level 4: The Enigma Vault
Deep within the system lies a treasure trove of data. Find the crack in the armor to gain access.

### Level 5: The Final Escape
The ultimate test of your skills. Combine everything you've learned to take control and find the exit.

## 🛠️ Admin Panel
For Game Masters and Administrators, an Admin Panel is available to monitor team progress in real-time.
- Access via the **Shield Icon** in the header (if logged in as admin).
- Access the **Game Master Guide** for administration and troubleshooting resources.

## ⚠️ Disclaimer
This application is a **simulation** designed for educational purposes only. All "hacks" are performed in a controlled, safe environment within the game's logic. Do not attempt to use these tools or techniques on real-world systems without explicit permission.
