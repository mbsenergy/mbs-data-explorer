# Use the official Node.js image
FROM node:18-alpine

# Install additional tools (e.g., Bun, curl, Git)
RUN apk add --no-cache git bash curl && npm install -g bun
RUN apk add --no-cache python3 make g++ && \
    npm install -g --force yarn


# Set the working directory inside the container
WORKDIR /workspace

# Copy package and lock files to install dependencies
COPY package.json package-lock.json ./
COPY bun.lockb ./ 

# Install dependencies
RUN npm install
# RUN bun install # Uncomment if using Bun

# Install VSCode extensions (optional, for better experience)
RUN npm install -g eslint prettier

# Expose the default React app development port
EXPOSE 3000

CMD ["sleep", "infinity"]
