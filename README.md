# FilmZone — Full-Stack Movie Review Application

FilmZone is a full–stack web application that allows users to browse movies, register and log in, add reviews, and access role-based features.  
The project consists of:

- a **FastAPI backend** for authentication, film management and review handling  
- a **Next.js frontend** providing an interactive UI for users and administrators  

---

## 🛠 Technology Stack

### **Backend**
- Python 3  
- FastAPI  
- SQLAlchemy ORM  
- Passlib (argon2 password hashing)  
- python-jose (JWT authentication)  
- SQLite (default database)  

### **Frontend**
- Next.js 14  
- React 18  
- TailwindCSS

---

## 🔧 Environment Variables — Backend (.env)

The backend includes an example environment file:
**backend/.env.example**

Change directory:
```PowerShell
cd backend
```
Copy the file:
```PowerShell
cp .env.example .env
```

Then fulfill data in .env.

---

## 📦 Backend Installation

From the root of the project:
```cmd
cd backend
```
1. Create a virtual environment
```
python -m venv venv
```
3. Activate the virtual environment

Windows (PowerShell):
```
.\venv\Scripts\activate.ps1
```

Windows (CMD):
```
venv\Scripts\activate.bat
```

Linux/macOS:
```
source venv/bin/activate
```
3. Install required dependencies
```
pip install -r requirements.txt
```
---
# ▶️ Running the Backend

Start the FastAPI backend:
```
uvicorn main:app --reload
```

Backend will be available at:
```
http://127.0.0.1:8000
```

Swagger API docs:
```
http://127.0.0.1:8000/docs
```
---
# 📦 Frontend Installation

From the project root:
```
cd frontend
```

Install all required dependencies:
```
npm install
```
---
# ▶️ Running the Frontend

Run the frontend development server:
```
npm run dev
```

Frontend is available at:
```
http://localhost:3000
```
