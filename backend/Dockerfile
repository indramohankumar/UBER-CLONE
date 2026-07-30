# Use the official Node.js image as our base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your backend code into the container
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# The command to run your server
CMD ["node", "server.js"]
