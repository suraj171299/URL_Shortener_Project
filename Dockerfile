# Use a specific Node.js version (v22.11.0)
FROM node:22.11.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (including production dependencies)
RUN npm install --production

# Copy the rest of your app's code into the container
COPY . .

# Expose port 8080 (since your local app uses this port)
EXPOSE $PORT

# Set environment variables for Redis connection if required
# Use your local Redis instance or set to the default Heroku Redis URL if deploying to Heroku
ENV NODE_ENV=production

# Command to run your Node.js app
CMD ["node", "src/index.js"]
