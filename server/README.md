# Monty API Server

A Node.js/Express.js API server for the Monty application.

## Features

- Express.js REST API
- CORS enabled for cross-origin requests
- Security headers with Helmet
- Request logging with Morgan
- Health check endpoint
- Error handling middleware

## Installation

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Server

### Development Mode

```bash
npm run dev
```

This will start the server with nodemon for automatic restarts on file changes.

### Production Mode

```bash
npm start
```

## API Endpoints

### GET /

Returns a success message indicating the API is running.

**Response:**

```json
{
  "success": true,
  "message": "Monty API is running successfully!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### GET /health

Health check endpoint for monitoring.

**Response:**

```json
{
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Configuration

The server runs on port 3001 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **nodemon**: Development server with auto-restart (dev dependency)
