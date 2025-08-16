# LankaGuide Docker Setup

This guide explains how to run the LankaGuide application using Docker Compose.

## Prerequisites

- Docker Desktop installed on your system
- Docker Compose (included with Docker Desktop)

## Quick Start

### Development Environment

1. **Clone the repository and navigate to the project directory:**

   ```bash
   cd CodeNova_LankaGuide
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file and update the values as needed.

3. **Start the application:**

   ```bash
   docker-compose up -d
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

### Production Environment

1. **Use the production compose file:**

   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

2. **Access the application:**
   - Frontend: http://localhost:80
   - Backend API: http://localhost:5000 (internal)

## Services

### MongoDB (Database)

- **Port:** 27017
- **Database:** lankaguide
- **Health Check:** Included
- **Data Persistence:** Volume mounted

### Backend (Node.js/Express)

- **Port:** 5000
- **Technology:** Express.js with MongoDB
- **Health Check:** Included
- **Auto-restart:** Configured

### Frontend (React/Vite)

- **Port:** 5173 (development) / 80 (production)
- **Technology:** React with Vite
- **Development:** Hot reload enabled

## Useful Commands

### Start services

```bash
docker-compose up -d
```

### Stop services

```bash
docker-compose down
```

### View logs

```bash
docker-compose logs -f [service-name]
```

### Rebuild services

```bash
docker-compose up -d --build
```

### Remove everything (including volumes)

```bash
docker-compose down -v
```

### Access service shell

```bash
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh
```

## Environment Variables

Key environment variables to configure:

- `MONGO_ROOT_USERNAME`: MongoDB root username
- `MONGO_ROOT_PASSWORD`: MongoDB root password
- `JWT_SECRET`: Secret key for JWT tokens
- `VITE_API_URL`: Frontend API endpoint URL

## Health Checks

All services include health checks:

- **MongoDB**: Connection test via mongosh
- **Backend**: HTTP request to root endpoint
- **Frontend**: HTTP request to served content

## Volumes

- `mongodb_data`: Persistent storage for MongoDB data

## Networks

- `lankaguide-network`: Internal bridge network for service communication

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 5173, 5000, and 27017 are not in use
2. **Permission issues**: On Linux/Mac, you might need to adjust file permissions
3. **Environment variables**: Ensure all required env vars are set in `.env`

### Check service status

```bash
docker-compose ps
```

### View service logs

```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Reset everything

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```
