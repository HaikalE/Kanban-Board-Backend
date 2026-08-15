# Kanban Board — Backend

Node.js backend for a full-stack Kanban task-management application.

The service provides authentication, PostgreSQL-backed application data, REST endpoints, and Socket.IO events used to synchronize task/board changes across connected frontend clients.

## Responsibilities

- user authentication with password hashing and JWTs
- board/task persistence in PostgreSQL
- REST API endpoints for application operations
- real-time update events with Socket.IO
- environment-based configuration with dotenv

## Stack

- Node.js
- Express
- PostgreSQL (`pg`)
- Socket.IO
- JSON Web Tokens
- bcrypt
- dotenv

## Related frontend

[HaikalE/Kanban-Board-Frontend](https://github.com/HaikalE/Kanban-Board-Frontend)

## Local development

Install dependencies:

```bash
git clone https://github.com/HaikalE/Kanban-Board-Backend.git
cd Kanban-Board-Backend
npm install
```

Configure the required environment variables for PostgreSQL and authentication, then run the application using the repository's Node entry point.

The companion frontend expects the local backend on port `5000` in its development configuration.

## Engineering focus

The project combines request/response APIs with asynchronous events. Database writes provide persistent state, while Socket.IO is used to notify connected clients when board or task data changes so the UI can remain synchronized.

This is a portfolio project rather than production infrastructure. A production deployment would additionally require stronger configuration management, automated test coverage, schema migrations, request validation, rate limiting, structured logging, and deployment/observability controls.

## Author

Muhammad Haikal Rahman  
[GitHub](https://github.com/HaikalE) · [Portfolio](https://haikale.github.io)
