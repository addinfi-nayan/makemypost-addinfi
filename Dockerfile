# Use the official Node.js 18 runtime as a parent image
FROM node:18-alpine AS base

# Install dependencies only when needed
RUN if [ -f "package.json" ]; then npm ci --only=production; fi

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
