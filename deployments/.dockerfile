FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production Stage
FROM nginx:stable-alpine

# Copy the build output from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
