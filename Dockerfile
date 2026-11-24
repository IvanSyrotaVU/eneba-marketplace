FROM php:8.3-cli
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/* \
    && docker-php-ext-install pdo pdo_mysql
WORKDIR /app
COPY backend /app/backend
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-8000} -t backend/public backend/public/index.php"]