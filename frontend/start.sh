#!/bin/sh

# Generate nginx config from environment variables
cat > /etc/nginx/conf.d/default.conf << EOF
server {
    listen ${PORT:-8080};
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;

    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api {
        proxy_pass ${BACKEND_URL};
        proxy_http_version 1.1;
        proxy_ssl_server_name on;
        proxy_set_header Host ${BACKEND_HOST:-agriai-production-3a70.up.railway.app};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    location /health {
        return 200 "ok";
    }
}
EOF

echo "=== Generated nginx config ==="
cat /etc/nginx/conf.d/default.conf
echo "=== Starting nginx ==="

exec nginx -g 'daemon off;'
