FROM node:22-bookworm-slim

# Prevent interactive prompts during apt install
ENV DEBIAN_FRONTEND=noninteractive

# Install JDK (Java), GCC (C), G++ (C++), Python 3, and python-is-python3
RUN apt-get update && apt-get install -y --no-install-recommends \
    default-jdk \
    gcc \
    g++ \
    python3 \
    python-is-python3 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy remaining project files
COPY . .

# Expose application port
EXPOSE 3000

# Startup command
CMD ["npm", "start"]
