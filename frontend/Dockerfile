# Frontend Dockerfile - React + Vite + Nginx
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json .npmrc ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Nginx with envsubst
FROM nginx:alpine

# Install envsubst (part of gettext)
RUN apk add --no-cache gettext

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Set default values (Railway overrides PORT)
ENV PORT=80
ENV BACKEND_URL=http://backend:8000

# Expose port (Railway ignores this, uses PORT env)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT}/ || exit 1

# Start nginx with envsubst - replace PORT and BACKEND_URL
CMD ["/bin/sh", "-c", "envsubst '$PORT $BACKEND_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && cat /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
