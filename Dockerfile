# Use Node.js LTS Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy app source code
COPY node.js/ ./node.js

# Expose the port your app listens on
EXPOSE 3000

# Start the Node.js app
CMD ["node", "Node.js/server.js"]
