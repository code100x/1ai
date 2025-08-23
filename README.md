# 1ai - AI-Powered Chat Application

<div align="center">

![1ai Logo](frontend/public/logo.svg)

**A modern, AI-powered chat application built with Next.js, Express, and Prisma**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](CONTRIBUTING.md)

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Contributing](#contributing) • [License](#license)

</div>

## 🚀 Features

- **AI Chat Interface**: Powered by multiple AI providers (OpenAI, Anthropic, Google)
- **Email Authentication**: Secure OTP-based authentication using Postmark
- **Real-time Chat**: Instant messaging with AI assistants
- **Conversation Management**: Save and organize chat history
- **Subscription System**: Premium features with payment integration
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: User preference support
- **Rate Limiting**: Built-in protection against abuse

## 🛠 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **React Hook Form** - Form handling
- **Zustand** - State management

### Backend
- **Express.js** - Node.js web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **Postmark** - Email service
- **Razorpay** - Payment processing
- **Rate Limiting** - API protection

### Development Tools
- **Bun** - Fast JavaScript runtime
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking

## 📦 Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh/)
- PostgreSQL database
- Postmark account (for email functionality)
- Razorpay account (for payments)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/1ai.git
   cd 1ai
   ```

2. **Set up the backend**
   ```bash
   cd backend
   bun install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Set up database
   bun prisma generate
   bun prisma migrate dev
   
   # Start backend server
   bun dev
   ```

3. **Set up the frontend**
   ```bash
   cd frontend
   bun install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   
   # Start frontend server
   bun dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3002
   - Backend: http://localhost:3000

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="your-super-secret-jwt-key-here"
POSTMARK_SERVER_TOKEN="your-postmark-server-token"
FROM_EMAIL="noreply@yourdomain.com"
NODE_ENV="development"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_KEY_SECRET="your-razorpay-secret"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_BACKEND_URL="http://localhost:3000"
```

## 🏗 Project Structure

```
1ai/
├── backend/                 # Express.js API server
│   ├── routes/             # API route handlers
│   ├── prisma/             # Database schema and migrations
│   ├── generated/          # Generated Prisma client
│   └── index.ts            # Server entry point
├── frontend/               # Next.js application
│   ├── app/                # App Router pages
│   ├── components/         # Reusable UI components
│   ├── lib/                # Utility functions
│   └── public/             # Static assets
├── .github/                # GitHub templates and workflows
├── CONTRIBUTING.md         # Contribution guidelines
├── CODE_OF_CONDUCT.md      # Community standards
└── README.md              # This file
```

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new functionality
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Prisma](https://www.prisma.io/) for the excellent database toolkit
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Postmark](https://postmarkapp.com/) for reliable email delivery
- [Razorpay](https://razorpay.com/) for payment processing

## 📞 Support

- 📧 Email: [your-email@example.com]
- 💬 Discord: [Join our community]
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/1ai/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/1ai/wiki)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/1ai&type=Date)](https://star-history.com/#yourusername/1ai&Date)

---

<div align="center">

Made with ❤️ by the 1ai community

[![GitHub contributors](https://img.shields.io/github/contributors/yourusername/1ai)](https://github.com/yourusername/1ai/graphs/contributors)
[![GitHub stars](https://img.shields.io/github/stars/yourusername/1ai)](https://github.com/yourusername/1ai/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/1ai)](https://github.com/yourusername/1ai/network)

</div>
