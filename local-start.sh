#!/bin/bash

echo "🚀 Iniciando Mi Alquiler en modo desarrollo local..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
composer install
npm install

# Configurar entorno
if [ ! -f .env ]; then
    echo "📋 Copiando .env.example a .env..."
    cp .env.example .env
    php artisan key:generate
fi

# Ejecutar migraciones
echo "📊 Ejecutando migraciones..."
php artisan migrate

# Ejecutar seeders
echo "🌱 Ejecutando seeders..."
php artisan db:seed

# Optimizar para desarrollo
echo "⚡ Optimizando cache..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ ¡Mi Alquiler está listo!"
echo "🌐 Ejecuta: php artisan serve"
echo "⚡ Y en otra terminal: npm run dev"