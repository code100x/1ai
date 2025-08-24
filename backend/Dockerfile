FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# Install bash and other necessary tools
RUN apt-get update -y && apt-get install -y openssl bash curl && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .
RUN bunx prisma generate

# Change ownership of the app directory to bun user
RUN chown -R bun:bun /usr/src/app
USER bun

EXPOSE 3000


CMD ["sh", "-c", "bunx prisma db push && bun start"]
