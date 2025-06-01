# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
