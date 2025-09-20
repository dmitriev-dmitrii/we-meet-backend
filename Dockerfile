FROM node:24

# Set the working directory in the container
WORKDIR /app

# Copy the application files into the working directory
COPY . /app

# Install the application dependencies
RUN npm ci

EXPOSE 3000

# Define the entry point for the container
CMD ["npm", "run" ,"start"]
