# Use a lightweight Node.js image with the specific version
FROM node:22.11.0-slim

# Set environment variables
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies with caching
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Expose the port the app will run on (Heroku dynamically sets the port)
EXPOSE 8080

# Define the default command to run your application
CMD ["node", "src/index.js"]
