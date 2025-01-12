# Base image
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Install a web server (nginx) to serve the React app
FROM nginx:alpine

# Copy the build folder from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port the app runs on
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
