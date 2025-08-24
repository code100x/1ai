# 1AI - Full-Stack AI Application

A modern full-stack AI application built with Next.js, Express, TypeScript, and PostgreSQL, featuring AI integration, authentication, and payment processing.

## 🚀 Features

- **AI Integration**: OpenAI and Google AI SDK integration
- **Authentication**: NextAuth.js with Prisma adapter
- **Database**: PostgreSQL with Prisma ORM
- **Payment Processing**: Stripe and Razorpay integration
- **Real-time Features**: tRPC for type-safe API communication
- **Modern UI**: Tailwind CSS with Radix UI components
- **Containerized**: Docker Compose for easy deployment

## 🏗️ Architecture

```
├── frontend/          # Next.js 15 frontend application
├── backend/           # Express.js backend API
├── docker-compose.yml # Docker orchestration
└── README.md         # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- [Bun](https://bun.sh/) (recommended) or [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)

## 🚀 Quick Start with Docker

The easiest way to get started is using Docker Compose:

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 1ai
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Database: localhost:5432

## 🛠️ Development Setup

### Option 1: Local Development (Recommended)

#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL="postgresql://1ai:mypassword@localhost:5432/mydb"
   JWT_SECRET="your-secret-key"
   OPENAI_API_KEY="your-openai-key"
   GOOGLE_AI_API_KEY="your-google-ai-key"
   POSTMARK_API_KEY="your-postmark-key"
   RAZORPAY_KEY_ID="your-razorpay-key"
   RAZORPAY_KEY_SECRET="your-razorpay-secret"
   STRIPE_SECRET_KEY="your-stripe-secret"
   ```

4. **Start PostgreSQL database**
   ```bash
   docker-compose up db -d
   ```

5. **Run database migrations**
   ```bash
   bun run prisma migrate dev
   ```

6. **Start the backend server**
   ```bash
   bun run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3002"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   STRIPE_PUBLISHABLE_KEY="your-stripe-publishable-key"
   RAZORPAY_KEY_ID="your-razorpay-key"
   ```

4. **Start the development server**
   ```bash
   bun run dev
   ```

5. **Open your browser**
   Navigate to http://localhost:3002

### Option 2: Docker Development

For development with Docker:

```bash
# Build and start services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🗄️ Database Management

### Prisma Commands

```bash
# Generate Prisma client
bun run prisma generate

# Run migrations
bun run prisma migrate dev

# Push schema changes
bun run prisma db push

# Open Prisma Studio
bun run prisma studio

# Reset database
bun run prisma migrate reset
```

## 🧪 Available Scripts

### Backend Scripts
```bash
bun run dev      # Start development server with hot reload
bun run start    # Start production server
```

### Frontend Scripts
```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint errors
bun run typecheck    # Run TypeScript type checking
bun run format:check # Check code formatting
bun run format:write # Format code
```

## 🌐 API Endpoints

The backend API runs on port 3000 and includes:

- **Authentication**: `/api/auth/*`
- **AI Services**: `/api/ai/*`
- **User Management**: `/api/users/*`
- **Payment Processing**: `/api/payments/*`

## 🔧 Configuration

### Environment Variables

Key environment variables needed:

- **Database**: `DATABASE_URL`
- **Authentication**: `JWT_SECRET`, `NEXTAUTH_SECRET`
- **AI Services**: `OPENAI_API_KEY`, `GOOGLE_AI_API_KEY`
- **Payment**: `STRIPE_SECRET_KEY`, `RAZORPAY_KEY_ID`
- **Email**: `POSTMARK_API_KEY`

### Port Configuration

- **Frontend**: 3002 (dev), 3001 (Docker)
- **Backend**: 3000
- **Database**: 5432

## 🚀 Deployment

### Production with Docker

1. **Build production images**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

2. **Set production environment variables**
   Update the docker-compose file with production values

### Manual Deployment

1. **Build frontend**
   ```bash
   cd frontend
   bun run build
   ```

2. **Start backend**
   ```bash
   cd backend
   bun run start
   ```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts**
   - Ensure ports 3000, 3001, 3002, and 5432 are available
   - Check if other services are using these ports

2. **Database connection issues**
   - Verify PostgreSQL is running
   - Check database credentials in environment variables
   - Ensure database exists and migrations are applied

3. **Dependency issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && bun install`
   - Update Bun: `bun upgrade`

### Logs

```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the logs for error messages
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly

For additional help, please open an issue in the repository.
