FROM node:20-slim

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Install Expo CLI
RUN npm install -g expo-cli

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the app
COPY . .

# Expose the Expo dev server port
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 8081