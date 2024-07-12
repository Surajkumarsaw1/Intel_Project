
# Project Title

This project uses React for the front end and Django for the backend.

## Dependencies

### Frontend (React)

```json
{
  "dependencies": {
    "22": "*",
    "@auth0/auth0-react": "^2.2.4",
    "@fortawesome/fontawesome-svg-core": "^6.5.2",
    "@fortawesome/free-solid-svg-icons": "^6.5.2",
    "@fortawesome/react-fontawesome": "^0.2.2",
    "@react-google-maps/api": "^2.19.3",
    "history": "^5.3.0",
    "react-google-places-autocomplete": "^4.0.1"
  }
}
```

### Backend (Django)

```
Django>=3.2.7
djangorestframework>=3.12.4
django-cors-headers>=3.7.0
requests>=2.26.0
```

## Installation

### Windows

Clone the repository:

```bash
git clone https://github.com/DarkNYX2003/Intel_Project.git
cd <repository-directory>
```

Install Django dependencies:

```bash
cd app_backend
python -m venv env
env\Scripts\activate
pip install -r requirements.txt
```

Install React dependencies:

```bash
cd ../necessity-navigator
npm install
```

Run the Django server:

```bash
cd ../app_backend
python manage.py runserver
```

Run the React development server:

```bash
cd ../necessity-navigator
npm start
```

### Linux

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

Install Django dependencies:

```bash
cd app_backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Install React dependencies:

```bash
cd ../necessity-navigator
npm install
```

Run the Django server:

```bash
cd ../app_backend
python manage.py runserver
```

Run the React development server:

```bash
cd ../necessity-navigator
npm start
```

### macOS

Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

Install Django dependencies:

```bash
cd app_backend
python3 -m venv env
source env/bin/activate
pip install -r requirements.txt
```

Install React dependencies:

```bash
cd ../necessity-navigator
npm install
```

Run the Django server:

```bash
cd ../app_backend
python manage.py runserver
```

Run the React development server:

```bash
cd ../necessity-navigator
npm start
```
