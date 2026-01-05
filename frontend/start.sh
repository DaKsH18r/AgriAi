#!/bin/sh
set -e

PORT="${PORT:-8080}"
echo "Using PORT: $PORT"

cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen $PORT;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass https://agriai-production-3a70.up.railway.app;
        proxy_http_version 1.1;
        proxy_ssl_server_name on;
        proxy_set_header Host agriai-production-3a70.up.railway.app;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

cat /etc/nginx/conf.d/default.conf
exec nginx -g 'daemon off;'
