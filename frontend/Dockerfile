# Frontend Dockerfile - React + Vite + Nginx
FROM node:20-alpine as builder

WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html
COPY start.sh /start.sh
RUN chmod +x /start.sh

ENV PORT=8080
ENV BACKEND_URL=https://agriai-production-3a70.up.railway.app
ENV BACKEND_HOST=agriai-production-3a70.up.railway.app

EXPOSE 8080

CMD ["/start.sh"]
