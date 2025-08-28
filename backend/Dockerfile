# Stage 1: Builder (Build the application and install dependencies)
FROM oven/bun:1 AS builder

WORKDIR /app

# Install system dependencies
RUN apt-get update -y && apt-get install -y openssl curl

# Copy package files and Prisma schema first
COPY package.json bun.lockb* ./
COPY prisma ./prisma

# Install all dependencies without running scripts
RUN bun install --frozen-lockfile --ignore-scripts

# Copy all source code
COPY . .

# Generate Prisma client manually
RUN bunx prisma generate


# Stage 2: Runtime (Create the runtime image)
FROM oven/bun:1 AS runtime

WORKDIR /app

# Install system dependencies
RUN apt-get update -y && apt-get install -y openssl curl

# Copy node_modules and generated Prisma client from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app ./

EXPOSE 3000
CMD ["bun", "index.ts"]
