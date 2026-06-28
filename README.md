# BuProp

Plataforma web para la **publicación, búsqueda, comparación y gestión de propiedades** en alquiler y venta (Villa Ángela, Chaco).

**Stack:** Laravel 12 · Inertia.js v2 · React 19 · Tailwind CSS v4 · PostgreSQL · Spatie Permission · Fortify.

---

## Requisitos

Para levantarlo en una máquina local necesitás tener instalado:

| Herramienta | Versión | Notas |
|---|---|---|
| **PHP** | 8.2 o superior | Con las extensiones `pdo_pgsql`, `mbstring`, `openssl`, `ctype`, `json`, `bcmath`, `fileinfo` |
| **Composer** | 2.x | Gestor de dependencias de PHP |
| **Node.js** | 20 o superior (LTS 22 recomendado) | Incluye `npm` |
| **Docker** + **Docker Compose** | reciente | Para levantar la base de datos PostgreSQL |
| **Git** | — | Para clonar el repositorio |

> La base de datos es **PostgreSQL** (el proyecto usa `ILIKE`, columnas `uuid` y timestamps con zona horaria). La forma más simple de tenerla es con Docker (ver abajo).
>
> **Opcional:** [Laravel Herd](https://herd.laravel.com) es un entorno todo-en-uno (macOS / Windows) que **ya incluye PHP** y sirve el proyecto en un dominio `.test`. Si lo usás, podés saltear la instalación manual de PHP y `php artisan serve` (ver [paso 6, Opción C](#6-levantar-la-aplicación)).

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/pelleranogiovanni/buprop.git
cd buprop
```

### 2. Levantar la base de datos con Docker

El repo incluye `docker-compose.dev.yml` que levanta **solo PostgreSQL y Redis** (la app corre en tu máquina):

```bash
docker compose -f docker-compose.dev.yml up -d
```

Esto deja PostgreSQL escuchando en `127.0.0.1:5433` con estos datos:

| | |
|---|---|
| Base de datos | `buprop` |
| Usuario | `buprop_user` |
| Contraseña | `buprop_pass` |
| Puerto (host) | `5433` |

> Si preferís levantar **todo** con Docker (app incluida), existe `docker-compose.yml` completo. Para desarrollo local recomendamos solo la BD.

### 3. Instalar dependencias

```bash
composer install
npm install
```

### 4. Configurar el entorno

```bash
cp .env.example .env
php artisan key:generate
```

Editá el `.env` y configurá la **conexión a PostgreSQL** (coincide con el Docker del paso 2):

```dotenv
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5433
DB_DATABASE=buprop
DB_USERNAME=buprop_user
DB_PASSWORD=buprop_pass
```

Y cargá tu **API key de Ollama** (ver sección [IA / Ollama](#ia--ollama)):

```dotenv
OLLAMA_API_KEY=tu_api_key_de_ollama
```

### 5. Migrar y cargar datos de ejemplo

```bash
php artisan migrate --seed        # esquema + roles, ciudad/barrios, usuarios y propiedades demo
php artisan db:seed --class=DemoSeeder   # (opcional) más datos: solicitudes de contacto/visita
php artisan storage:link          # enlace para las imágenes subidas
```

### 6. Levantar la aplicación

Elegí **una** de estas opciones:

**Opción A — un solo comando** (servidor + colas + Vite):

```bash
composer run dev
```
Abrí **http://localhost:8000**

**Opción B — manual**, en dos terminales:

```bash
php artisan serve     # backend  →  http://localhost:8000
npm run dev           # frontend (Vite)
```
Abrí **http://localhost:8000**

**Opción C — Laravel Herd** (opcional):

[Herd](https://herd.laravel.com) sirve el proyecto automáticamente (incluye PHP, **no** necesitás `php artisan serve`). Asegurate de que la carpeta esté en un directorio *parkeado* o enlazala con:

```bash
herd link buprop      # crea el dominio https://buprop.test
```

Luego levantá solo Vite y abrí el sitio:

```bash
npm run dev           # frontend (Vite)
```
Abrí **https://buprop.test** 🎉

---

## IA / Ollama

El **comparador de propiedades** incluye una *evaluación asistida por IA* para usuarios autenticados con preferencias cargadas. Usa la **API pública de Ollama** (`https://ollama.com/api/generate`, modelo `minimax-m3:cloud`).

Configuración en `.env`:

```dotenv
OLLAMA_URL=https://ollama.com/api/generate
OLLAMA_API_KEY=tu_api_key_de_ollama   # obtenela en https://ollama.com
OLLAMA_MODEL=minimax-m3:cloud
OLLAMA_TIMEOUT=25
```

> **La API key es opcional.** Si no está configurada, o si Ollama falla/no responde, el comparador **no se rompe**: muestra igualmente un análisis generado por reglas (fallback determinístico) con su aclaración orientativa. La key solo habilita la evaluación generada por el modelo.

---

## Usuarios de prueba

Tras correr los seeders, podés ingresar con cualquiera de estos usuarios (contraseña: **`password`**):

| Rol | Email | Contraseña |
|---|---|---|
| Admin | `admin@buprop.com` | `password` |
| Propietario (owner) | `maria@example.com` | `password` |
| Inmobiliaria (agency) | `carlos@inmobiliaria.com` | `password` |
| Interesado (tenant) | `juan@example.com` | `password` |
| Interesado (tenant) | `ana@example.com` | `password` |
| Interesado (tenant) | `luis@example.com` | `password` |

> Para probar el comparador con IA, ingresá como **interesado** y cargá preferencias de búsqueda.

---

## Comandos útiles

```bash
php artisan migrate:fresh --seed     # reinicia la BD y recarga datos demo
npm run build                        # compila assets para producción
composer test                        # corre los tests (Pest)
npm run types                        # chequeo de tipos (tsc --noEmit)
npm run lint                         # ESLint
docker compose -f docker-compose.dev.yml down   # apaga la BD
```

---

## Demo

🔗 **Demo online:** _(próximamente)_

<!-- Reemplazar por el link cuando esté desplegado, por ejemplo: https://buprop.example.com -->
