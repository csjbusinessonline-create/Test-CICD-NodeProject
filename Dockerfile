# Use a Node.js base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Set the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]