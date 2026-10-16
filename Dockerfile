# Use a Node.js base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy dependency manifests first
COPY package.json package-lock.json ./

# Install exact dependencies from the lockfile
RUN npm ci --omit=dev

# Copy application source (filtered by .dockerignore)
COPY . .

# Set the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]