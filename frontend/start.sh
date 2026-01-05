#!/bin/sh
set -e

echo "Starting nginx on port 80 - static files only"

cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # SPA routing - all routes serve index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check
    location /health {
        return 200 "ok";
    }
}
EOF

echo "Nginx config:"
cat /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
