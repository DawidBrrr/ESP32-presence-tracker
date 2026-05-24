# Presence Tracker API (Frontend)

Base URL (Docker): http://localhost:8080

## Auth

POST /api/auth/register

Request:
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "token": "<jwt>"
}
```

POST /api/auth/login

Request:
```json
{
  "usernameOrEmail": "john",
  "password": "password123"
}
```
Response (same shape as register).

Use the token for protected endpoints:
```
Authorization: Bearer <jwt>
```

## Device registration (device -> backend)

POST /api/devices/register

Request:
```json
{
  "id": "device-001",
  "token": "<DEVICE_REGISTRATION_TOKEN>"
}
```
Response:
```json
{
  "id": "device-001",
  "name": "device-001"
}
```

## User devices (JWT required)

POST /api/user/devices

Request:
```json
{
  "id": "device-001"
}
```
Response:
```json
{
  "id": "device-001",
  "created": true
}
```

GET /api/user/devices

Response:
```json
[
  { "id": "device-001", "name": "device-001" },
  { "id": "device-002", "name": "Sala A" }
]
```

DELETE /api/user/devices/{id}

Response: 204 No Content (or 404 if no access).

GET /api/user/devices/last

Response:
```json
[
  {
    "id": "device-001",
    "count": 3,
    "timestamp": "2026-05-17T18:20:40.123Z"
  }
]
```

## WebSocket (JWT required)

WebSocket endpoint: ws://localhost:8080/ws

STOMP CONNECT header:
```
Authorization: Bearer <jwt>
```

Subscribe:
```
/user/queue/telemetry
```

Message payload:
```json
{
  "id": "device-001",
  "count": 4,
  "timestamp": "2026-05-17T12:34:56.789Z"
}
```
