<div align="center">

# NestJS React Router

<p align="center">
  <img src="assets/logos/nestjs-logo.svg" alt="NestJS Logo" width="120" height="120"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="assets/logos/rr_logo_light.svg" alt="React Router Logo" width="120" height="120"/>
</p>

🚀 **The ultimate full-stack TypeScript framework** combining NestJS + React Router + Fastify + SSR

<p align="center">
  <strong>Combining the power of NestJS and React Router for a seamless full-stack experience</strong>
</p>

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue.svg)](https://www.typescriptlang.org/)
[![React Router](https://img.shields.io/badge/React%20Router-7.9+-61DAFB.svg)](https://reactrouter.com/)
[![NestJS](https://img.shields.io/badge/NestJS-10.4+-E0234E.svg)](https://nestjs.com/)

</div>

## ✨ Features

- ⚡ **Blazing fast** with Fastify and Vite
- 🎯 **Type-safe** end-to-end with TypeScript
- 🔄 **SSR + SPA** with React Router 7 Data Mode
- 🏗️ **Enterprise-ready** with NestJS architecture
- 🎨 **Beautiful UI** with Tailwind CSS
- 📦 **Monorepo** with Turborepo
- 🔧 **Modern tooling** with Biome for linting and formatting
- 🗄️ **Database ready** with Drizzle ORM
- 📊 **Caching** with Redis
- 🚀 **Production ready** with Docker support

## 🏗️ Architecture

This is a **monorepo** that combines:

- **Backend**: NestJS with Fastify for high-performance APIs
- **Frontend**: React Router 7 with server-side rendering
- **Database**: Drizzle ORM with PostgreSQL
- **Caching**: Redis for session management and caching
- **Styling**: Tailwind CSS with a modern design system
- **Build**: Vite for fast development and building
- **Monorepo**: Turborepo for efficient builds and development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL (for database)
- Redis (for caching)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/nestjs-react-router.git
   cd nestjs-react-router
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your database and Redis credentials
   ```

4. **Set up the database**

   ```bash
   pnpm db:push
   ```

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open your browser**

   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
nestjs-react-router/
├── apps/
│   ├── server/                 # NestJS backend application
│   │   ├── src/
│   │   │   ├── main.ts        # Application entry point
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   └── plugins/
│   │   └── package.json
│   └── web/                   # React Router frontend application
│       ├── src/
│       │   ├── entry-client.tsx
│       │   ├── entry-server.tsx
│       │   ├── routes.tsx
│       │   └── index.css
│       └── package.json
├── packages/
│   ├── db/                    # Database package with Drizzle ORM
│   ├── redis/                 # Redis client package
│   └── shared/                # Shared utilities and types
├── package.json
├── turbo.json
├── biome.json
└── README.md
```

## 🛠️ Available Scripts

### Root Level Commands

```bash
# Development
pnpm dev                    # Start development server

# Building
pnpm build                  # Build all packages

# Code Quality
pnpm lint                   # Lint all packages
pnpm lint:fix              # Fix linting issues
pnpm format                # Format code
pnpm check                 # Run all checks
pnpm check:fix             # Fix all issues

# Type Checking
pnpm typecheck             # Type check all packages
```

### Package-Specific Commands

```bash
# Server (NestJS)
pnpm --filter @nestjs-react-router/server dev
pnpm --filter @nestjs-react-router/server build

# Web (React Router)
pnpm --filter @nestjs-react-router/web build
pnpm --filter @nestjs-react-router/web preview

# Database
pnpm --filter @nestjs-react-router/db drizzle:push
pnpm --filter @nestjs-react-router/db drizzle:studio
```

## 🎨 UI Components

The project includes a modern design system built with:

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming (light/dark mode support)
- **Radix UI** for accessible components
- **Class Variance Authority** for component variants
- **Tailwind Merge** for conditional styling

## 🗄️ Database

The project uses **Drizzle ORM** with PostgreSQL:

- **Type-safe** database queries
- **Migrations** with Drizzle Kit
- **Studio** for database management
- **Connection pooling** for performance

### Database Commands

```bash
# Generate migrations
pnpm db:generate

# Push schema changes
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

## 🚀 Deployment

### Docker

The project includes Docker configuration for easy deployment:

```bash
# Build Docker image
docker build -t nestjs-react-router .

# Run with Docker Compose
docker-compose up -d
```

### Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nestjs_react_router"

# Redis
REDIS_URL="redis://localhost:6379"

# Server
PORT=3000
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Use **Biome** for linting and formatting
- Follow **TypeScript** best practices
- Write **meaningful commit messages**
- Add **tests** for new features
- Update **documentation** as needed

## 📚 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [React Router Documentation](https://reactrouter.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Turborepo Documentation](https://turbo.build/repo)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) for the amazing backend framework
- [React Router](https://reactrouter.com/) for the modern routing solution
- [Drizzle](https://orm.drizzle.team/) for the type-safe ORM
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Turborepo](https://turbo.build/) for the monorepo build system

---

**Built with ❤️ using modern web technologies**
