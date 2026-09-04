# 🚀 Smart Progress Tracker (Career OS)

## Measure Real Learning Progress, Not Just Activity

A full-stack SaaS-style web application that tracks daily tasks and learning behavior to evaluate **actual skill growth, consistency, and job readiness** using a weighted scoring system.

---

## 🌐 Live Demo

🚀 Frontend: https://smart-progress-tracker-black.vercel.app <br>
🔗 Backend API: https://smart-progress-tracker.onrender.com

---

## 🎯 Problem

Traditional tools only track task completion. They don't tell you:
- ❓ Are you actually improving?
- ❓ Which skills are strong/weak?
- ❓ Are you consistent?
- ❓ Are you job-ready?

---

## 💡 Solution

Smart Progress Tracker uses **weighted scoring** to measure real progress:
Task Score = (Actual Time) × (Difficulty Multiplier) × (Completion %)

---

## 🛠️ Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React + Vite       |
| Styling   | Tailwind CSS       |
| Charts    | Recharts           |
| Backend   | Node.js + Express  |
| Database  | MongoDB Atlas      |
| Auth      | JWT                |

---

## 📊 Features

### Input Layer
- ✅ Daily Task Logger with skill tags
- ✅ Grid & List view
- ✅ Difficulty levels (Easy/Medium/Hard)

### Logic Layer  
- ✅ Weighted Progress Calculation
- ✅ Weekly Progress Percentage
- ✅ Skill Analysis Engine
- ✅ Goal vs Actual Comparison

### Output Layer
- ✅ Progress Bars & Charts
- ✅ Skill Heatmap
- ✅ Daily Productivity Chart
- ✅ Planned vs Actual Chart
- ✅ Monthly Summary

### Intelligence Layer
- ✅ Consistency Tracker (Streaks)
- ✅ Automated Weekly Review
- ✅ Job Readiness Score

---

## 🚀 Setup Instructions

### Setup Backend

cd server
npm install
> Create .env file with your MongoDB URI and JWT secret
npm run dev

### Setup Fronted
cd client
npm install
npm run dev

### 4. Open Browser
http://localhost:5173

---

### 📸 Screenshots
# Dashboard
Weekly progress, charts, skill distribution
<p align="center"><img width="1920" height="1764" alt="image" src="https://github.com/user-attachments/assets/05ba6321-9cdc-4a14-aa59-76c550152645" /></p>


# Task Logger
Add tasks with skill tags, difficulty, time tracking
<p align="center"><img width="1920" height="2382" alt="image" src="https://github.com/user-attachments/assets/68680296-91da-4afe-b8e1-a911d282b9bf" />
</p>

# Analytics
Skill analysis, heatmap, consistency tracker
<p align="center"><img width="1920" height="2841" alt="analysts page" src="https://github.com/user-attachments/assets/d2ad3719-78c0-49f7-b80f-3a4f98a16e5e" />
</p>

# Job Readiness
Composite score from skills, projects, consistency
<p align="center"><img width="1920" height="1656" alt="analysts page" src="https://github.com/user-attachments/assets/36991d83-4893-409f-8d3a-85726e73fc0e" />
</p>

---

### 🏗️ Architecture

User

➡️ Task Logger

➡️  MongoDB

➡️ Progress Engine (Weighted Calculation)

➡️ Skill Analyzer + Consistency Tracker

➡️ Charts + Insights + Job Readiness Score

➡️ React Dashboard (Visual Output)

---

### 📈 Weighted Progress Formula

Task Score = (actualTime/60) × difficultyMultiplier × (completion/100)

Difficulty Multipliers:
  Easy   = 1.0x
  Medium = 1.5x  
  Hard   = 2.5x

Weekly Progress = (Total Score / Expected Score) × 100

---

### 🎯 Job Readiness Score Components


| Component           | Weight       |
|---------------------|--------------|
| Skill Coverage	  | 30%          |
| Skill Depth         | 25%          |
| Project Work        | 20%          |
| Consistency         | 15%          |
| Difficulty Level    | 10%          |


---

## 🔒 Security

- JWT Authentication  
- Password hashing (bcrypt)  
- Protected routes  
- Environment variable security  

---

## 🧪 Future Improvements

- AI-based insights  
- Smart recommendations  
- Mobile app version  
- Advanced analytics  

---

### 📜 License
MIT License
