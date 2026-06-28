# VaultX 🔐

A secure file vault built with Django REST Framework that provides encrypted file storage, version management, fine-grained access control, and JWT-based authentication.

---

## Features

* User registration with Email OTP verification
* Optional Two-Factor Authentication (2FA)
* JWT Authentication
* Encrypted file storage
* Automatic file versioning
* Version history management
* Per-file access control (Viewer / Editor)
* Secure SHA-256 integrity verification
* Password reset via Email OTP

---

## Tech Stack

### Backend

* Python
* Django
* Django REST Framework
* Simple JWT

### Database

* PostgreSQL (via `DATABASE_URL`)

### Security

* JWT Authentication
* Email OTP Verification
* SHA-256 File Integrity Validation
* Encrypted File Storage

---

## Project Structure

```text
VaultX/
│
├── app/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── services.py
│   ├── urls.py
│   └── migrations/
│
├── VaultX/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── manage.py
├── requirements.txt
└── README.md
```

---

## Installation

```bash
git clone <repository-url>

cd VaultX

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver
```

---

## Authentication Flow

1. Register with email
2. Verify OTP
3. Login using JWT Authentication
4. Enable or disable 2FA (optional)

---

## File Management

* Upload encrypted files
* Maintain version history
* Restore previous versions
* Automatic version pruning
* Share files with Viewer or Editor permissions

---

## API Highlights

* User Registration
* Email Verification
* Login & JWT Authentication
* Password Reset
* Upload File
* Manage Versions
* Access Control
* Activity Tracking

---

## Future Improvements

* Docker support
* API documentation (Swagger/OpenAPI)
* File sharing via secure links
* Audit dashboard
* Cloud storage integration

---

## Contributors

* Project developed collaboratively by the VaultX team.

---

## License

This project is intended for educational and learning purposes.
