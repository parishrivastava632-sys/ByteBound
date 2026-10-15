# Stage 1: Build & Dependencies
FROM node:20-alpine AS runner

WORKDIR /app

# Set Cloud Run standard environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Cloud Run binds to port 8080 by default
EXPOSE 8080

# Run with non-root user for security best practice
USER node

# Start the microservice
CMD ["node", "server.js"]
