# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files from web-app directory
COPY web-app/package*.json ./

# Install dependencies
RUN npm install

# Copy React app source code
COPY web-app/ .

ENV NODE_OPTIONS="--max_old_space_size=4096"


# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]