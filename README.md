# FilmZone
🎥 FilmZone - A platform for reviewing movies and discovering new films.

---

## 🚀 Getting Started

Follow these steps to set up and run the FilmZone backend application locally. This guide assumes you are working within a Python virtual environment.

### ⚙️ Prerequisites

Ensure you have the following installed on your system:

* **Python** (Version 3.8 or higher)
* **PostgreSQL** (The database server must be running and accessible)

---

### 1. Cloning and Dependency Installation

1.  Clone the repository:
    ```bash
    git clone [YOUR_REPOSITORY_ADDRESS]
    cd filmzone/backend
    ```

2.  **Install the required packages:**
    ```bash
    pip install fastapi uvicorn "sqlalchemy" "psycopg2-binary" "pydantic-settings" "passlib[bcrypt]" "python-jose"
    ```
    or
    ```bash
    pip install -r requirements.txt
    ```

### 2. Environment Configuration (.env)

The application uses **Pydantic-Settings** for configuration, which loads variables from an `.env` file.

Rename file **.env.example** to **`.env`** and set yours DATABASE_URL and SECRET_KEY.
