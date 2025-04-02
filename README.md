# 🎬 Cinemax - Movie Rating and Organization App

## 📌 Project Description
Cinemax is a web application that allows users to browse a movie database, view detailed information about productions, and organize them into private lists. Users can rate watched movies, making it a personal movie diary. Unlike popular services, this application is designed **for a single user** and does not include social features.

## ✨ Key Features
- Browse the movie database
- View detailed movie information (description, cast, availability on streaming platforms)
- Create private movie lists
- Rate movies on a 1-10 scale
- Manage personal data and watch history

## 🛠️ Technologies
This project was built using:

### 🔹 **Frontend**
- React – dynamic user interface
- TypeScript – type-safe code

### 🔹 **Backend**
- Django – application logic and database management
- Django ORM – database management using SQLite

### 🔹 **API**
- TMDB API – fetching movie information and streaming availability

## 📦 Installation & Setup
To run the project locally, follow these steps:

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-user/movie-journal.git
cd movie-journal
```

### 2️⃣ Install dependencies
#### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # for Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Frontend (React)
```bash
cd frontend
npm install
npm start
```
