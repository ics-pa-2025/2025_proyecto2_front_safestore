## Multi-stage Dockerfile for Vite + React
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy sources
COPY . .

# Build args for environment variables
ARG VITE_API_URL
ARG VITE_AUTH_API_URL

# Set environment variables for build
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL

# Build the application
RUN npm run build

## Production image
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
