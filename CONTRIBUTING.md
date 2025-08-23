# Contributing to 1ai

Thank you for your interest in contributing to 1ai! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database
- Postmark account (for email functionality)

### Backend Setup

```bash
cd backend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client
bun prisma generate

# Run migrations
bun prisma migrate dev

# Start development server
bun dev
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
bun dev
```

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="your-super-secret-jwt-key-here"
POSTMARK_SERVER_TOKEN="your-postmark-server-token"
FROM_EMAIL="noreply@yourdomain.com"
NODE_ENV="development"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
```

## Code Style

### General Guidelines

- Follow the existing code style and conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Write self-documenting code

### TypeScript/JavaScript

- Use TypeScript for type safety
- Prefer `const` over `let` when possible
- Use arrow functions for callbacks
- Use async/await over Promises
- Add proper type annotations

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use proper prop types or TypeScript interfaces
- Keep components focused and reusable

### Database

- Use Prisma for database operations
- Write clear and efficient queries
- Add proper indexes for performance
- Use transactions when needed

## Testing

### Running Tests

```bash
# Backend tests
cd backend
bun test

# Frontend tests
cd frontend
bun test
```

### Writing Tests

- Write tests for new features
- Ensure good test coverage
- Use descriptive test names
- Test both success and error cases

## Pull Request Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the code style guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Use the provided PR template
   - Describe your changes clearly
   - Link any related issues
   - Add screenshots if applicable

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

## Issue Reporting

### Before Creating an Issue

1. Check if the issue has already been reported
2. Search the existing issues and discussions
3. Try to reproduce the issue with the latest version

### Creating an Issue

- Use the appropriate issue template
- Provide clear and detailed information
- Include steps to reproduce
- Add screenshots or error messages
- Specify your environment details

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and constructive
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments
- Personal or political attacks
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

## Getting Help

- Check the [documentation](README.md)
- Search existing issues
- Join our community discussions
- Contact the maintainers

## License

By contributing to 1ai, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to 1ai! 🚀
