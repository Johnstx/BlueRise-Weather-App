# Use the official Node.js image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies declared in package.json
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on (for example, port 3000)
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
