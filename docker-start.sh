#!/bin/bash

echo "🚀 Iniciando Buprop con Docker..."

# Copiar archivo de entorno
if [ ! -f .env ]; then
    echo "📋 Copiando .env.docker a .env..."
    cp .env.docker .env
fi

# Construir y levantar contenedores
echo "🐳 Construyendo contenedores..."
docker-compose up -d --build

# Esperar a que la base de datos esté lista
echo "⏳ Esperando que la base de datos esté lista..."
sleep 30

# Generar clave de aplicación
echo "🔑 Generando clave de aplicación..."
docker-compose exec buprop-app php artisan key:generate

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
docker-compose exec buprop-app php artisan migrate

# Ejecutar seeders (opcional)
echo "🌱 Ejecutando seeders..."
docker-compose exec buprop-app php artisan db:seed

echo "✅ ¡Buprop está listo!"
echo "🌐 Aplicación: http://localhost:8080"
echo "🗄️  Base de datos PostgreSQL: localhost:5433"
echo "⚡ Vite dev server: http://localhost:5174"