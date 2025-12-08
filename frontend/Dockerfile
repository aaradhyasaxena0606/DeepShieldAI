# VoiceGuard AI Frontend - Dockerfile
## Use a Node 20.x slim image to satisfy package engine requirements
FROM node:20.19.0-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies. Use `npm install` in the container to avoid failing
# the build if package.json and package-lock.json are out of sync.
RUN npm install --no-audit --no-progress

# Copy application code
COPY . .

# Expose port
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]