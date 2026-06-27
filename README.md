# VaultX

> Simple Django-based encrypted file vault with versioning, per-item access control, and email OTP flows.

## Overview
- Small REST API built with Django + Django REST Framework.
- Features: user registration with email verification (OTP), optional 2FA on login, JWT authentication, encrypted file versioning, per-item ACL (viewer/editor), and version pruning.

Key components:
- `app.models` — `User`, `VerificationCode`, `Item`, `ItemVersion`, `ItemAccess`, `ItemVersionActivity`.
- `app.services` — `create_item_version()` handles creating versions and pruning old ones.
- `app.serilizer` — DRF serializers and upload validation (base64 + SHA256 checks).
- `app.views` — API endpoints for registration, verification, login, password reset, items, versions and access management.

## Requirements
- Python 3.10+ (project uses modern typing in code)
- See `requirements.txt` for exact packages (Django, djangorestframework, simplejwt, corsheaders, etc.)

## Quickstart
1. Create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Provide a database URL and other secrets (example using environment variables):

```powershell
$env:DATABASE_URL = "postgres://USER:PASS@HOST:PORT/DBNAME"
$env:SECRET_KEY = "replace-with-your-secret"
```

4. Run migrations and start the server:

```powershell
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## API notes
- Authentication uses JWT (`rest_framework_simplejwt`).
- Registration flow: POST OTP request → verify OTP to create user.
- File upload: client must upload ciphertext (base64) + nonce (base64) + sha256 hex; server validates integrity and stores binary ciphertext in `ItemVersion.file`.
- Item versioning keeps `version_limit` per-item and prunes older versions in `create_item_version()`.

## Tests
- Basic test scaffold exists at `app/tests.py`. Add tests and run with `python manage.py test`.

## Development notes
- Settings are in `VaultX/settings.py` (CORS and JWT already configured).
- Custom user model: `AUTH_USER_MODEL = "app.User"`.

## Files added
- `.gitignore` — sensible defaults for Python / Django / Windows development.

---
If you want, I can also add example API requests (curl/Postman) or run the test suite.
