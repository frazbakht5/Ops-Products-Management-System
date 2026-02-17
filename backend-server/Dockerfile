FROM node:18-alpine AS builder

WORKDIR /app

# Install deps (including dev for TypeScript build)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY tsconfig.json tsconfig.app.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production

# Install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy built artifacts
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "start"]
