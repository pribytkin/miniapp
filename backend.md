# 🎯 Specialists Directory API

A FastAPI-based REST API for managing a directory of specialists with their services, locations, reviews, and categories.

## ✨ Features

- 🔄 Complete CRUD operations for all entities
- 🔍 Advanced filtering and search capabilities
- 🌍 Geolocation-based search
- ⭐️ Rating and review system
- 🏷️ Service categorization
- 📍 Location management with primary/secondary locations
- 🟢 Specialist availability tracking
- 🐘 PostgreSQL database with SQLAlchemy ORM
- 🐳 Docker-based development environment
- 📚 Automatic API documentation

## 📋 Prerequisites

- 🐳 Docker and Docker Compose
- 🔄 Git

## 🚀 Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Start the services with Docker Compose:
```bash
docker-compose up --build
```

The API will be available at http://localhost:8000

## 📖 API Documentation

Once the application is running, you can access:
- 🔍 Interactive API documentation (Swagger UI): http://localhost:8000/docs
- 📱 Alternative API documentation (ReDoc): http://localhost:8000/redoc

## 🛣️ API Endpoints

### 👥 Specialists

#### Create Specialist
```http
POST /api/v1/specialists/
```
Request:
```json
{
  "telegram_id": "123456789",
  "name": "John Doe",
  "bio": "Professional plumber with 10 years of experience",
  "phone": "+34612345678",
  "telegram_username": "johndoe",
  "location_type": "both",
  "photo_url": "https://example.com/photo.jpg"
}
```
Response:
```json
{
  "id": 1,
  "telegram_id": "123456789",
  "name": "John Doe",
  "bio": "Professional plumber with 10 years of experience",
  "phone": "+34612345678",
  "telegram_username": "johndoe",
  "location_type": "both",
  "photo_url": "https://example.com/photo.jpg",
  "availability_status": "offline",
  "rating": 0.0,
  "total_reviews": 0,
  "is_verified": false,
  "last_active": "2024-01-20T12:00:00",
  "created_at": "2024-01-20T12:00:00",
  "updated_at": "2024-01-20T12:00:00"
}
```

#### List Specialists
```http
GET /api/v1/specialists/?category_id=1&location_type=on_site&availability=available
```
Response:
```json
[
  {
    "id": 1,
    "telegram_id": "123456789",
    "name": "John Doe",
    "location_type": "both",
    "availability_status": "available",
    "rating": 4.5,
    "total_reviews": 10,
    "is_verified": true,
    "categories": [
      {
        "id": 1,
        "name": "Plumbing",
        "icon": "🔧",
        "description": "Plumbing services"
      }
    ]
  }
]
```

- `GET /api/v1/specialists/` - List specialists with filtering options:
  - 🏷️ Filter by category
  - 📍 Filter by location type (on-site, remote, both)
  - 🟢 Filter by availability status
  - 🔍 Search by name or bio
  - ✅ Filter by verification status
- `GET /api/v1/specialists/{specialist_id}` - Get specialist details
- `PUT /api/v1/specialists/{specialist_id}` - Update specialist
- `DELETE /api/v1/specialists/{specialist_id}` - Delete specialist
- `PUT /api/v1/specialists/{specialist_id}/verify` - Verify specialist
- `PUT /api/v1/specialists/{specialist_id}/status` - Update availability status

### 🏷️ Categories

#### Create Category
```http
POST /api/v1/categories/
```
Request:
```json
{
  "name": "Plumbing",
  "icon": "🔧",
  "description": "All types of plumbing services"
}
```
Response:
```json
{
  "id": 1,
  "name": "Plumbing",
  "icon": "🔧",
  "description": "All types of plumbing services"
}
```

- `POST /api/v1/categories/` - Create a new category
- `GET /api/v1/categories/` - List all categories
- `GET /api/v1/categories/{category_id}` - Get category details
- `PUT /api/v1/categories/{category_id}` - Update category
- `DELETE /api/v1/categories/{category_id}` - Delete category

### 🛠️ Services

#### Add Service to Specialist
```http
POST /api/v1/specialists/1/services
```
Request:
```json
{
  "name": "Pipe Repair",
  "description": "Fix leaking pipes and plumbing issues",
  "price_min": 50.0,
  "price_max": 200.0,
  "duration": 60
}
```
Response:
```json
{
  "id": 1,
  "specialist_id": 1,
  "name": "Pipe Repair",
  "description": "Fix leaking pipes and plumbing issues",
  "price_min": 50.0,
  "price_max": 200.0,
  "duration": 60
}
```

- `POST /api/v1/specialists/{specialist_id}/services` - Add service to specialist
- `GET /api/v1/specialists/{specialist_id}/services` - List specialist's services
- `GET /api/v1/services/{service_id}` - Get service details
- `PUT /api/v1/services/{service_id}` - Update service
- `DELETE /api/v1/services/{service_id}` - Delete service
- `GET /api/v1/services` - List all services with filtering:
  - 💰 Filter by price range
  - ⏱️ Filter by duration

### ⭐️ Reviews

#### Create Review
```http
POST /api/v1/specialists/1/reviews
```
Request:
```json
{
  "user_id": "987654321",
  "rating": 5,
  "comment": "Excellent service, very professional and punctual!"
}
```
Response:
```json
{
  "id": 1,
  "specialist_id": 1,
  "user_id": "987654321",
  "rating": 5,
  "comment": "Excellent service, very professional and punctual!",
  "created_at": "2024-01-20T14:30:00"
}
```

- `POST /api/v1/specialists/{specialist_id}/reviews` - Create review
- `GET /api/v1/specialists/{specialist_id}/reviews` - List specialist's reviews
- `GET /api/v1/reviews/{review_id}` - Get review details
- `PUT /api/v1/reviews/{review_id}` - Update review
- `DELETE /api/v1/reviews/{review_id}` - Delete review

### 📍 Locations

#### Add Location
```http
POST /api/v1/specialists/1/locations
```
Request:
```json
{
  "address": "Calle Gran Via 1, Madrid",
  "latitude": 40.4168,
  "longitude": -3.7038,
  "service_area": "Madrid Centro",
  "is_primary": true
}
```
Response:
```json
{
  "id": 1,
  "specialist_id": 1,
  "address": "Calle Gran Via 1, Madrid",
  "latitude": 40.4168,
  "longitude": -3.7038,
  "service_area": "Madrid Centro",
  "is_primary": true
}
```

- `POST /api/v1/specialists/{specialist_id}/locations` - Add location
- `GET /api/v1/specialists/{specialist_id}/locations` - List specialist's locations
- `GET /api/v1/locations/{location_id}` - Get location details
- `PUT /api/v1/locations/{location_id}` - Update location
- `DELETE /api/v1/locations/{location_id}` - Delete location
- `GET /api/v1/locations/nearby` - Find nearby locations

#### Find Nearby Locations
```http
GET /api/v1/locations/nearby?latitude=40.4168&longitude=-3.7038&radius=5
```
Response:
```json
[
  {
    "id": 1,
    "specialist_id": 1,
    "address": "Calle Gran Via 1, Madrid",
    "latitude": 40.4168,
    "longitude": -3.7038,
    "service_area": "Madrid Centro",
    "is_primary": true
  }
]
```

## 📊 Data Models

### 👤 Specialist
- 📝 Basic information (name, bio, contacts)
- 📍 Location type (on-site, remote, both)
- 🟢 Availability status
- ✅ Verification status
- ⭐️ Rating and review count
- 📍 Multiple locations
- 🛠️ Multiple services
- 🏷️ Category assignments

### 🏷️ Category
- 📝 Name
- 🎨 Icon
- 📄 Description
- 👥 Associated specialists

### 🛠️ Service
- 📝 Name
- 📄 Description
- 💰 Price range
- ⏱️ Duration
- 👤 Associated specialist

### ⭐️ Review
- 🌟 Rating (1-5)
- 💬 Comment
- 👤 User ID (Telegram)
- 🕒 Creation timestamp
- 👤 Associated specialist

### 📍 Location
- 📝 Address
- 🌍 Coordinates (latitude, longitude)
- 🗺️ Service area
- ⭐️ Primary/secondary status
- 👤 Associated specialist

## 🛠️ Development

### 🔧 Manual Setup (without Docker)

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the PostgreSQL database:
```bash
docker-compose up -d db
```

4. Apply database migrations:
```bash
PYTHONPATH=$PYTHONPATH:. alembic upgrade head
```

5. Start the FastAPI application:
```bash
uvicorn app.main:app --reload
```

### 🔄 Database Migrations

To create a new migration:
```bash
PYTHONPATH=$PYTHONPATH:. alembic revision --autogenerate -m "Migration message"
```

To apply migrations:
```bash
PYTHONPATH=$PYTHONPATH:. alembic upgrade head
```

## ⚙️ Environment Variables

The application uses the following environment variables (automatically set in docker-compose.yml):

- 🖥️ `POSTGRES_SERVER` (default: "db" in Docker, "localhost" otherwise)
- 👤 `POSTGRES_USER` (default: "postgres")
- 🔑 `POSTGRES_PASSWORD` (default: "postgres")
- 📦 `POSTGRES_DB` (default: "ua_businesses_spain")
- 🔌 `POSTGRES_PORT` (default: "5432")

## 📁 Project Structure

```
backend/
├── alembic/              # 🔄 Database migrations
├── app/
│   ├── api/             # 🛣️ API endpoints
│   │   └── v1/
│   │       └── endpoints/
│   ├── core/            # ⚙️ Core configuration
│   ├── db/              # 🐘 Database setup
│   ├── models/          # 📊 SQLAlchemy models
│   └── schemas/         # 📋 Pydantic schemas
├── docker-compose.yml   # 🐳 Docker configuration
├── Dockerfile          # 🐳 Docker build file
├── requirements.txt    # 📦 Python dependencies
└── README.md          # 📖 This file
```