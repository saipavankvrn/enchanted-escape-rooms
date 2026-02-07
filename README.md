# The Shadow's House - Cybersecurity Escape Room

**The Shadow's House** is an immersive, cybersecurity-themed escape room game designed for educational and entertainment purposes. Built with the MERN stack (MongoDB, Express, React, Node.js), it challenges players to apply real-world cybersecurity concepts to escape a digital construct within a 50-minute time limit.

---

## 🎮 Game Walkthrough & Objectives

The player's goal is to navigate 5 levels, each representing a "room" in The Shadow's digital house. To progress, players must collect **Code Fragments ("Bytes")** by solving 3 sub-puzzles in each level. These fragments combine to form a **Secret Key** (e.g., `LEVEL-1-COMPLETE`, `SHADOW`) which unlocks the next stage.

### Level 1: The Whispering Porch (Phishing)
*Theme: Social Engineering & Email Analysis*
**Mission:** Identify malicious elements in a corporate email inbox.
*   **Tools:** Simulated Email Client, Malware Scanner.
1.  **Task 1 (The Sender):** Analyze `Amazon` emails. Find the one from `amazon@verify-acc.com` (Typosquatting/Spoofed Domain). Flag it to recover Fragment 1 (`LEVEL-`).
2.  **Task 2 (The Link):** Open the "HR Policy" email. Identify the deceptive link pointing to an insecure HTTP site (`http://company-hr-portal.net`) instead of the official HTTPS portal. Click it to simulate a successful identification. Recovers Fragment 2 (`1-COM`).
3.  **Task 3 (The Attachment):** Activate the "Scanner Tool" and hover over the `report.pdf` attachment. The scanner reveals it as `report.pdf.exe` (Double Extension Malware). Isolate it to recover Fragment 3 (`PLETE`).
**Solution:** Combine fragments to enter `LEVEL-1-COMPLETE`.

### Level 2: The Hall of Mirrors (OSINT & Deepfakes)
*Theme: Open Source Intelligence & Verification*
**Mission:** Distinguish authentic digital footprints from fabrications.
*   **Tools:** Social Feed, EXIF Lens, Video Analyzer.
1.  **Task 1 (Timeline Analysis):** Review the target's social feed. The bio says "Paris, Oct 15". Find the contradictory post tagged "Berlin, Oct 15". Flag it to recover Fragment 1 (`SH`).
2.  **Task 2 (Metadata Forensics):** Use the "EXIF Lens" on the suspect image. The visual content shows a bunker, but the metadata reveals GPS coordinates in New York City. Confirm the lie to recover Fragment 2 (`AD`).
3.  **Task 3 (Deepfake Detection):** Analyze 3 video clips. One clip has lips that are out of sync with the audio waveform. Report the synthetic media to recover Fragment 3 (`OW`).
**Solution:** Combine fragments to form the key `SHADOW`.

### Level 3: The Cursed Library (Passwords & Brute Force)
*Theme: Authentication Security*
**Mission:** Audit and crack password systems.
*   **Tools:** Password List, Voltage Meter.
1.  **Task 1 (Complexity Audit):** Identify 3 "Strong" passwords from a list of note scraps. Valid passwords must have Uppercase, Number, and Symbol (e.g., `S7r0ng!`, `#C0d3r`, `L0ck&Key`). Selecting correctly unlocks Fragment 1 (`CIP`).
2.  **Task 2 (Voltage Sequence):** Order the selected passwords by length (Ascending: 6 chars -> 7 chars -> 8 chars) to power the "Voltage Meter". This simulates a Brute Force attack flow. Unlocks Fragment 2 (`HER`).
**Solution:** Combine fragments to form the key `CIPHER`.

### Level 4: The Enigma Vault (SQL Injection)
*Theme: Web Application Security*
**Mission:** Exploit a database vulnerability to bypass authentication.
*   **Tools:** Database Explorer, Admin Terminal.
1.  **Task 1 (Schema Reconnaissance):** Inspect the database tables (`products`, `orders`, `users`). Locate the vulnerable column `is_admin` in the `users` table. Identifying this vector unlocks Fragment 1 (`ENIG`).
2.  **Task 2 (Auth Bypass):** Access the Admin Login Terminal. The standard password is unknown. Use an SQL Injection payload in the username field: `admin' --` (or similar) to comment out the password check. Unlocks Fragment 2 (`MA`).
**Solution:** Combine fragments to form the key `ENIGMA`.

### Level 5: The Final Escape (Master Challenge)
*Theme: Network Security & Cryptography*
**Mission:** Execute a full system override.
*   **Tools:** Network Scanner, Decryption Module, Command Line.
1.  **Task 1 (Firewall Penetration):** Scan the network grid. Identify the node running insecure `HTTP` on Port 80, while others are secure `HTTPS/SSH`. exploit the weak protocol to recover Fragment 1 (`ES`).
2.  **Task 2 (Decryption):** Decipher the intercepted hash `H V F D S H`. Recognizing it as a Caesar Cipher (Shift -3) reveals `E S C A P E`. Enter the decrypted key to recover Fragment 2 (`CA`).
3.  **Task 3 (Kernel Override):** Access the Command Line Interface. Use the `help` command to find `sudo system_override`. Execute it to shut down the simulation and recover Fragment 3 (`PE`).
**Solution:** Combine fragments to form the final key `ESCAPE`.

---

## 🛠️ Technical Overview

### Architecture
-   **Frontend:** React 18, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion.
-   **Backend:** Node.js, Express.
-   **Database:** MongoDB (Stores User State, Timestamps, Sub-task progress).
-   **Real-time:** Socket.IO for live leaderboard updates.

### Key Features
-   **Persistent State:** Game progress (levels and individual sub-tasks) is saved to MongoDB. A player can refresh or switch devices and resume exactly where they left off.
-   **The Byte System:** Granular progress tracking. Instead of binary "Level Complete", users collect partial keys ("Bytes") for immediate feedback.
-   **Admin Dashboard:** Real-time monitoring of active teams, level progress, and completion times with a Game Master Guide for spoilers.

---

## 🚀 Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone <repository_url>
    cd enchanted-escape-rooms
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the `server` directory:
    ```env
    MONGO_URI=mongodb+srv://<your_connection_string>
    JWT_SECRET=your_secret_key
    PORT=5000
    ```

4.  **Run the Game**
    Start both Frontend and Backend concurrently:
    ```sh
    npm run dev
    ```
    -   Frontend: `http://localhost:8080` (or as assigned by Vite)
    -   Backend: `http://localhost:5000`

5.  **Access Admin Panel**
    Navigate to `/admin`.
    -   **Default Admin Credentials:** (Check `server/seed.js` or create manually via registration with `@escape.edu.in` email).

---

## ⚠️ Spoilers & Solutions Summary

| Level | Theme | Tools | Key | Fragments |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Phishing | Email Client, Malware Scanner | `LEVEL-1-COMPLETE` | `LEVEL-`, `1-COM`, `PLETE` |
| **2** | OSINT | Social Feed, EXIF Lens, Video Analyzer | `SHADOW` | `SH`, `AD`, `OW` |
| **3** | Passwords | Complexity Checker, Voltage Meter | `CIPHER` | `CIP`, `HER` |
| **4** | SQLi | DB Explorer, Admin Terminal | `ENIGMA` | `ENIG`, `MA` |
| **5** | Master | Port Scanner, Decryptor, CLI | `ESCAPE` | `ES`, `CA`, `PE` |
