# Video Processing Queue System

This project implements a video processing queue system using a modern tech stack. It allows users to upload videos, which are then processed asynchronously using a distributed queue system.

## Technologies Used

- Backend:

  - NestJS (Node.js framework)
  - Bull (Redis-based queue for Node.js)
  - Drizzle ORM (TypeScript ORM)
  - PostgreSQL (Database)
  - Redis (for queue management)
  - AWS S3 (for video storage)
  - Docker (for containerization)

- Frontend:
  - Next.js (React framework)
  - React Hook Form (for form handling)
  - SWR (for data fetching)

## Features

- Video upload with metadata
- Asynchronous video processing
- Real-time status updates
- Distributed queue system for scalability
- Error handling and dead letter queue
- Docker containerization for easy deployment

## Project Structure

The project is set up as a monorepo using Turborepo.
