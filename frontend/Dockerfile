# Frontend Dockerfile - React + Vite + Nginx
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

RUN apk add --no-cache gettext
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY --from=builder /app/dist /usr/share/nginx/html

ENV PORT=80
ENV BACKEND_URL=http://backend:8000

EXPOSE 80

# Simple startup - envsubst then nginx
CMD /bin/sh -c "envsubst '\$PORT \$BACKEND_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"
