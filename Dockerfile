# Use the official Node.js image as a base
FROM node:18-slim

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Start the Node.js application
CMD ["node", "index.js"]
