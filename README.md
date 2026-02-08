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
**Focus:** Phishing Analysis & Threat Detection
- Analyze a simulated inbox.
- Identify social engineering attempts.
- safely handle malicious payloads.

### Level 2: The Hall of Mirrors
**Focus:** Open-Source Intelligence (OSINT)
- Analyze multimedia assets.
- Geolocation and temporal analysis.
- Verify intelligence against public records.

### Level 3: Targeted Penetration
**Focus:** Dictionary Attacks & Brute Force
- Perform reconnaissance on a target website.
- Generate custom wordlists using `cewl`.
- Launch a dictionary attack using `hydra`.

### Level 4: The Enigma Vault
**Focus:** Web Application Security (SQL Injection)
- Analyze database schemas.
- Identify vulnerable input fields.
- Bypass authentication mechanisms using SQL injection techniques.

### Level 5: The Final Escape
**Focus:** Network Security & Cryptography
- Scan for insecure network protocols.
- Decrypt secured communications.
- Execute system overrides via terminal.

## 🛠️ Admin Panel
For Game Masters and Administrators, an Admin Panel is available to monitor team progress in real-time.
- Access via the **Shield Icon** in the header (if logged in as admin).
- View the **Game Master Guide** for specific solutions and troubleshooting (Hidden from standard players).

## ⚠️ Disclaimer
This application is a **simulation** designed for educational purposes only. All "hacks" are performed in a controlled, safe environment within the game's logic. Do not attempt to use these tools or techniques on real-world systems without explicit permission.
