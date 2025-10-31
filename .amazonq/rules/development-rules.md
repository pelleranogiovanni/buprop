# Development Rules — Mi Alquiler  
*(Laravel + Inertia + React + Tailwind + shadcn/ui)*

> Documento de lineamientos de desarrollo y buenas prácticas para mantener código limpio, escalable y visualmente consistente con los estilos definidos en Figma.

---

## 1. Resumen del prototipo “Mi Alquiler” (TFG)

**Mi Alquiler** es un prototipo web para **publicación y gestión de propiedades** en alquiler o venta.  
El sistema permite que distintos tipos de usuarios gestionen sus interacciones inmobiliarias:

- **admin:** gestiona usuarios, publicaciones y procesos de moderación.  
- **owner:** publica y administra propiedades propias.  
- **agency:** inmobiliaria que gestiona propiedades de terceros.  
- **tenant:** inquilino interesado en contactar o agendar visitas.

### Funciones principales

- Gestión de **propiedades** con amenities, fotos y ubicación.  
- Creación y moderación de **listings** (publicaciones).  
- **Solicitudes de contacto** y **pedidos de visita** entre usuarios.  
- Roles y permisos gestionados con **Spatie Laravel Permission**.  
- Frontend SPA con **React + Tailwind + shadcn/ui**, integrando los estilos definidos en **Figma**.  
- Backend **Laravel 12 + Inertia** con políticas de seguridad, validaciones y arquitectura limpia.

---

## 2. Principios

- **Reutilizable antes que rápido:** priorizar componentes UI composables y props claras sobre soluciones ad-hoc.  
- **Convención sobre configuración:** estructura estable, nombres predecibles, pocas sorpresas.  
- **Seguridad y performance by default:** validación, autorización y eficiencia desde el inicio.

---

## 3. Estructura del proyecto

```
apps/
└─ laravel/
   ├─ app/
   │  ├─ Http/
   │  │  ├─ Controllers/
   │  │  ├─ Middleware/
   │  │  └─ Requests/
   │  ├─ Models/
   │  ├─ Policies/
   │  ├─ Services/
   │  ├─ Rules/
   │  └─ ViewModels/
   ├─ database/
   │  ├─ migrations/
   │  ├─ seeders/
   │  └─ factories/
   ├─ resources/
   │  └─ js/
   │     ├─ app.tsx
   │     ├─ lib/
   │     ├─ routes/
   │     ├─ styles/
   │     ├─ components/
   │     │  ├─ ui/
   │     │  ├─ form/
   │     │  ├─ layout/
   │     │  └─ data/
   │     ├─ pages/
   │     └─ features/
   ├─ routes/
   │  ├─ web.php
   │  └─ api.php
   ├─ config/
   └─ tests/
```

---

## 4. Backend (Laravel 12)

### 4.1. Controladores y Requests

- Validar siempre con **FormRequest** en `app/Http/Requests`.  
- No incluir lógica de negocio en controladores: delegar a **Services**.  
- Respuestas Inertia: `return Inertia::render('pages/...', [...props])`.  
- Props pesadas → usar `Inertia::lazy(fn() => ...)`.

### 4.2. Autorización y roles

- Paquete: **spatie/laravel-permission v6** (`HasRoles` en `User`).  
- Roles definidos:  
  - `admin`: gestión global del sistema.  
  - `owner`: propietario de inmueble.  
  - `agency`: inmobiliaria que gestiona propiedades de terceros.  
  - `tenant`: inquilino interesado en alquilar.  
- Policies por recurso (CRUD) y middleware `permission:` en rutas.

### 4.3. Rutas y contratos

- Prefijo y convención de recursos:  
  `Route::resource('listings', ListingController::class);`  
- Mantener contratos (DTO/Resource) estables; actualizar tipos TS cuando cambien props compartidas.

### 4.4. Persistencia

- Migraciones atómicas y reversibles.  
- Uso de `uuid` en entidades de dominio.  
- `users.id` se mantiene como `bigint` autoincremental.  
- Seeders para datos de entorno local (nunca información sensible).

### 4.5. Seguridad

- Validación de entrada con **FormRequest** (sanitización y reglas).  
- Autorización con roles/permissions.  
- Rate limiting para acciones sensibles (login, mensajes). 

### 4.6. Modelos y arquitectura MVC

El backend debe seguir la arquitectura **Modelo / Vista / Controlador (MVC)** propia de Laravel:

- **Modelo:**  
  - Representa las entidades de negocio y se vincula directamente con las tablas de la base de datos.  
  - Cada modelo (`app/Models/*`) debe definir sus relaciones (`hasMany`, `belongsTo`, `hasOne`, `belongsToMany`) y reglas de casting.  
  - No incluir lógica de negocio compleja en los modelos; solo comportamientos propios de la entidad (scopes, accessors, mutators, casts).  
  - Usar **Eloquent ORM** para obtener, crear, actualizar o eliminar registros.  
  - Ejemplo:
    ```php
    $properties = Property::with(['city', 'owner'])
        ->where('available', true)
        ->orderBy('created_at', 'desc')
        ->get();
    ```

- **Controlador:**  
  - Recibe las peticiones, invoca los modelos o servicios necesarios, y retorna vistas Inertia o respuestas JSON.  
  - No debe contener reglas de validación ni lógica de negocio; esas van en **FormRequest** o **Services**.

- **Vista:**  
  - Se implementa con **Inertia.js**, que conecta el backend Laravel con componentes de React en `resources/js/pages`.  
  - El controlador debe devolver `Inertia::render('PageName', [...props])`, y las vistas React manejan la presentación.

**Reglas generales:**
- Toda lectura o escritura en la base de datos debe pasar por un **Modelo Eloquent**.  
- Evitar consultas SQL crudas salvo en casos justificados de performance.  
- Centralizar consultas reutilizables mediante **Query Scopes** (`scopeActive`, `scopeOwnedBy`, etc.).  
- Mantener consistencia de nombres: modelo singular (`Property`), tabla plural (`properties`).  
- Asegurar integridad mediante relaciones, validaciones y políticas.

---

## 5. Frontend (React + Inertia + Tailwind + shadcn/ui)

### 5.1. shadcn/ui y composición

- No editar directamente componentes base en `components/ui/*`.  
- Personalización mediante **wrappers** que:
  - Exponen `className` y variantes usando **CVA**.  
  - Permiten `iconLeft`, `iconRight` y `asChild` (Radix).  
- Mantener **accesibilidad**: `aria-*`, roles y asociación `Label/Input`.
- Componentes reutilizables.

### 5.2. Tailwind

- Clases ordenadas por **prettier-plugin-tailwindcss**.  
- Factorizar utilidades repetidas en `cn()` + variantes CVA.  
- Diseño **mobile-first**, responsive con breakpoints `sm` → `xl`.

### 5.3. Inertia

- `pages/*` = vistas principales; mínima lógica interna.  
- Estados de carga o errores con spinners/skeletons.  
- Navegación con `Link` de Inertia y formularios con `useForm`.

### 5.4. Formularios y validación

- Validación **server-side** (`FormRequest`) + **client-side** opcional con zod.  
- Componentes comunes en `components/form/*`:  
  `FormField`, `InputText`, `Select`, `DatePicker`, etc.  
- Mostrar errores devueltos por Inertia con helper `getError('field')`.

### 5.5. Tipos compartidos

- Mantener tipado en `resources/js/lib/types.ts`.  
- Sincronizar con `Laravel Resource` o `ViewModel`.

---

## 6. Código limpio

### 6.1. Nombres y organización

- Componentes React: `PascalCase`; funciones/hooks: `camelCase`.  
- Un componente por archivo (dividir si supera 150 líneas).  
- Evitar efectos secundarios dentro del render.

---

## 11. Principios finales

- Mantener coherencia entre **diseño, UX y desarrollo**.  
- Optimizar para lectura, no para escritura: el código debe ser **autoexplicativo**.  
- Pequeños commits, PRs enfocados, revisiones ágiles.  
- Evolucionar las reglas a medida que el proyecto crece.

## 11. Doc Componentes y Figma de referencia
- Link shadcn: https://ui.shadcn.com/docs/components
Figma de referencia: https://www.figma.com/design/kxsYSOOBGRTtX8sZSMoxVf/Estatery---Real-Estate-SaaS-Kit---Dashboard--Preview-?node-id=275-5849&p=f&t=Sj9JHmPuZUAnjPTr-0