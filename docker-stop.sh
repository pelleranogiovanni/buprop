#!/bin/bash

echo "🛑 Deteniendo Buprop..."

# Detener contenedores
docker-compose down

echo "✅ Contenedores detenidos"
echo "💡 Para eliminar también los volúmenes: docker-compose down -v"