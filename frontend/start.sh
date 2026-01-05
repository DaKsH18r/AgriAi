#!/bin/sh

# Generate nginx config
cat > /etc/nginx/conf.d/default.conf << 'NGINX_CONF'
resolver 8.8.8.8 valid=30s;

server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        set $backend "https://agriai-production-3a70.up.railway.app";
        proxy_pass $backend;
        proxy_http_version 1.1;
        proxy_ssl_server_name on;
        proxy_set_header Host agriai-production-3a70.up.railway.app;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_connect_timeout 30s;
        proxy_read_timeout 60s;
    }

    location /health {
        return 200 "ok";
    }
}
NGINX_CONF

exec nginx -g 'daemon off;'
