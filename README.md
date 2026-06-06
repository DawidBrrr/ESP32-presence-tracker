# ESP32 Presence Tracker

A room occupancy tracking system based on ESP32 microcontrollers. The system collects telemetry data from IoT devices, processes it, and provides real-time updates to web and mobile clients.

## Project Structure

The repository is divided into four main components:

### 1. `backend/`
A Spring Boot 3 application (Java 21) that serves as the core data processing and API server. The codebase is organized into domain-driven packages:
- **`config/`**: Configuration classes for CORS, Kafka, and InfluxDB.
- **`device/`**: Device management, registration logic, and associations between users and devices.
- **`security/`**: JWT-based authentication and Spring Security filter chains.
- **`telemetry/`**: Kafka consumers for handling incoming MQTT bridged messages and saving them to the database.
- **`user/`**: User account management and authentication endpoints.
- **`websocket/`**: STOMP over WebSocket configuration for broadcasting telemetry updates to connected clients.

**Database Layer:**
- **PostgreSQL**: Stores relational data including `User` accounts, `Device` metadata, and `UserDeviceAccess` mappings (defining which users can view which devices).
- **InfluxDB**: Used as a Time-Series Database (TSDB) to store high-frequency telemetry data (occupancy counts and timestamps) efficiently.

### 2. `frontend/`
A React application built with TypeScript and Vite. It serves as the main web dashboard.
- Communicates with the backend via REST API for state management and WebSocket for real-time telemetry updates.
- Uses standard React hooks and local storage for session management.

### 3. `mobile/`
A React Native application built with Expo.
- Replicates the web dashboard functionality for mobile devices.
- Connects to the local network backend API and WebSocket endpoints.

### 4. `StressTester/`
A load simulation tool written in Go.
- Simulates multiple virtual ESP32 devices sending concurrent HTTP registration requests and MQTT telemetry payloads.
- Containerized via Docker to bypass host OS network and port limitations during high-concurrency testing.

---

## Infrastructure Stack (Docker Compose)

The environment is orchestrated using Docker Compose and includes the following services:

1. **Eclipse Mosquitto**: MQTT broker acting as the entry point for ESP32 devices.
2. **Node-RED**: Integration and workflow engine (university course requirement).
3. **Apache Kafka**: Message queue that buffers data from Mosquitto and streams it to the Spring Boot backend.
4. **PostgreSQL**: Relational database.
5. **InfluxDB**: Time-series database.
6. **Monitoring Stack**:
   - **Telegraf**: Collects host and container resource metrics (CPU, RAM, Disk I/O).
   - **Prometheus**: Aggregates metrics from Telegraf and Mosquitto Exporter.
   - **Grafana**: Visualizes metrics on port `3100`.

---

## Running the Application

To start the backend infrastructure and services:
```bash
cd backend
docker compose up -d
```

To run the load tester (after the backend is running):
```bash
docker run --rm -it stresstester
```
Use `CTRL+C` to terminate the load simulation.
