# Development Rules — BruProp
*(Laravel + Inertia + React + Tailwind + shadcn/ui)*

Documento de lineamientos de desarrollo para mantener el código limpio, consistente, reutilizable y alineado con el prototipo visual definido para **BruProp**.

---

## 1. Resumen del proyecto

**BruProp** es un prototipo web para la publicación, búsqueda, comparación y gestión de propiedades en alquiler o venta.

El sistema permite que distintos tipos de usuarios interactúen dentro de una red inmobiliaria local:

- **admin:** gestiona usuarios, roles, publicaciones y procesos de moderación.
- **owner:** publica y administra propiedades propias.
- **agency:** inmobiliaria que gestiona propiedades propias o de terceros.
- **interested:** usuario interesado en buscar propiedades, guardar preferencias, contactar y solicitar visitas.

### Funciones principales

- Gestión de propiedades con fotos, ubicación, características y disponibilidad.
- Creación y moderación de publicaciones.
- Búsqueda por filtros y lenguaje natural básico.
- Comparación de propiedades seleccionadas.
- Registro y edición de preferencias de búsqueda.
- Solicitudes de contacto y visitas.
- Roles y permisos con Spatie Laravel Permission.
- Frontend SPA con React, Inertia, Tailwind y shadcn/ui.
- Backend Laravel 12 con Inertia, PostgreSQL, policies, FormRequests y services.

---

## 2. Principios generales

- **Reutilizable antes que rápido:** priorizar componentes reutilizables y código mantenible antes que soluciones puntuales.
- **Convención sobre configuración:** usar nombres, rutas y estructuras predecibles.
- **Seguridad por defecto:** validar, autorizar y proteger acciones sensibles desde el inicio.
- **Performance por defecto:** evitar consultas innecesarias, N+1 queries y cargas pesadas.
- **Consistencia visual:** respetar el prototipo definido en `BuProp-prototipo.pen`.
- **Código autoexplicativo:** optimizar para lectura y mantenimiento.

---

## 3. Estructura general del proyecto

```txt
app/
├─ Http/
│  ├─ Controllers/
│  ├─ Middleware/
│  └─ Requests/
├─ Models/
├─ Policies/
├─ Services/
├─ Rules/
└─ ViewModels/

database/
├─ migrations/
├─ seeders/
└─ factories/

resources/
└─ js/
   ├─ app.tsx
   ├─ lib/
   ├─ components/
   │  ├─ ui/
   │  ├─ form/
   │  ├─ layout/
   │  └─ data/
   ├─ pages/
   └─ features/

routes/
├─ web.php
└─ api.php

config/
tests/
```

---

# 4. Frontend

## 4.1. Fuente visual principal

El diseño de pantallas, estructura visual, jerarquías, distribución de elementos y flujos de interfaz deben tomarse del archivo:

```txt
BuProp-prototipo.pen
```

El archivo se encuentra en la **raíz del proyecto**.

Antes de implementar o modificar cualquier pantalla, se debe revisar el prototipo en `BuProp-prototipo.pen`.

No se deben inventar layouts, pantallas ni variantes visuales que contradigan el prototipo.

Si una pantalla no está claramente definida en `BuProp-prototipo.pen`, debe resolverse siguiendo el mismo criterio visual del resto del prototipo.

---

## 4.2. Idioma

- Todo texto visible para el usuario debe estar en **español**.
- Nombres de archivos, componentes, variables, props, funciones, tipos y rutas deben estar en **inglés**.

Ejemplo:

```tsx
<Button>Guardar preferencias</Button>

interface SearchPreference {
    id: number;
    property_type: string;
    max_price: number | null;
}
```

---

## 4.3. Base visual y componentes

El frontend debe usar **shadcn/ui** como base y reutilizar siempre los componentes actuales del proyecto.

Usar primero:

```txt
resources/js/components/ui/
resources/js/components/
```

Reglas principales:

- Siempre construir interfaces usando componentes.
- No duplicar componentes existentes.
- No editar directamente componentes base de `components/ui/*`, salvo ajuste global justificado.
- No usar estilos inline para resolver diseño.
- No hardcodear colores si existen tokens o variantes.
- No construir manualmente botones, inputs, cards, badges, modales, tabs, tablas o formularios si ya existe un componente.

---

## 4.4. Componentes reutilizables

Crear un componente nuevo solo si:

- No existe uno equivalente.
- Se va a reutilizar en más de una pantalla.
- Representa una pieza propia del dominio de BruProp.

Ejemplos válidos:

```txt
property-card.tsx
property-gallery.tsx
property-status-badge.tsx
search-preference-summary.tsx
contact-request-status-badge.tsx
publication-status-badge.tsx
```

---

## 4.5. Buenas prácticas React

- Componentes en `PascalCase`.
- Funciones y hooks en `camelCase`.
- Un componente por archivo cuando sea posible.
- Dividir componentes grandes.
- Evitar lógica compleja dentro del JSX.
- Extraer lógica repetida a helpers o hooks.
- Usar `Link` de Inertia para navegación interna.
- Usar `useForm` de Inertia para formularios.
- Mostrar errores de validación devueltos por backend.
- Mantener accesibilidad básica: labels, `aria-*`, roles y estados visibles.

---

## 4.6. TypeScript

- Definir siempre `interface` para props de páginas y componentes.
- Evitar `any`.
- Usar nullabilidad explícita.
- Tipar retornos cuando no sean obvios.
- Mantener tipos compartidos en `resources/js/lib/types.ts` o estructura equivalente.

Ejemplo:

```tsx
interface Property {
    id: number;
    title: string;
    property_type: string;
    operation_type: string;
    price: number | null;
    city: {
        id: number;
        name: string;
    } | null;
}

interface Props {
    properties: {
        data: Property[];
        links: unknown[];
        meta: {
            total: number;
        };
    };
    filters: {
        search?: string;
        property_type?: string;
        operation_type?: string;
    };
}
```

---

## 4.7. Tailwind

- Usar Tailwind respetando los tokens del proyecto.
- Ordenar clases con `prettier-plugin-tailwindcss`.
- Factorizar combinaciones repetidas con `cn()` y variantes.
- Diseño mobile-first.
- Usar breakpoints progresivos: `sm`, `md`, `lg`, `xl`.

Evitar:

```tsx
className="bg-blue-100 text-blue-700"
className="text-[#0B7D6E]"
style={{ marginTop: 12 }}
```

Preferir:

```tsx
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="mt-3"
```

---

# 5. Backend

## 5.1. Idioma

- Todo el código debe estar en **inglés**.
- Clases, métodos, variables, rutas, columnas de base de datos y relaciones deben estar en **inglés**.
- Los mensajes visibles para el usuario deben estar en **español**.
- Los comentarios pueden estar en español si explican lógica de negocio.

Ejemplo:

```php
return redirect()
    ->route('properties.index')
    ->with('success', 'Propiedad creada correctamente.');
```

---

## 5.2. Naming conventions

### Modelos

Modelos en singular y PascalCase:

```txt
User
Property
PropertyImage
Publication
SearchPreference
ContactRequest
VisitRequest
City
Province
Country
```

Relaciones en inglés:

```php
user()
property()
publication()
images()
contactRequests()
visitRequests()
searchPreferences()
```

---

### Controllers

Controllers en singular, PascalCase y con sufijo `Controller`:

```txt
PropertyController
PublicationController
SearchPreferenceController
ContactRequestController
VisitRequestController
UserController
```

Métodos estándar:

```txt
index
create
store
show
edit
update
destroy
```

Métodos adicionales descriptivos en camelCase:

```txt
approve
reject
toggleActive
requestVisit
markAsRead
```

---

### Rutas

Rutas en plural, kebab-case y en inglés:

```txt
/properties
/properties/{property}
/publications
/publications/{publication}/approve
/search-preferences
/contact-requests
/visit-requests
```

Nombres de ruta con punto:

```txt
properties.index
properties.store
publications.approve
publications.reject
search-preferences.update
contact-requests.index
visit-requests.store
```

Parámetros en singular:

```txt
{property}
{publication}
{contactRequest}
{visitRequest}
```

---

### Base de datos

Tablas en plural, snake_case e inglés:

```txt
users
properties
property_images
publications
search_preferences
contact_requests
visit_requests
cities
provinces
countries
```

Columnas en snake_case:

```txt
first_name
last_name
property_type
operation_type
price
currency
description
address
latitude
longitude
created_at
updated_at
deleted_at
```

Foreign keys:

```txt
user_id
property_id
city_id
province_id
country_id
publication_id
```

Booleanos con nombre descriptivo:

```txt
active
is_verified
is_featured
is_available
```

Evitar nombres genéricos:

```txt
flag
status_bool
check
value
```

---

## 5.3. Arquitectura Laravel

El backend debe seguir una arquitectura limpia basada en Laravel MVC, separando responsabilidades.

### Controllers

Los controllers deben ser delgados. Solo deben:

1. Recibir el request.
2. Autorizar la acción si corresponde.
3. Validar la entrada mediante FormRequest.
4. Llamar al service correspondiente.
5. Retornar una respuesta Inertia, redirect o JSON.

No deben contener lógica de negocio.

Ejemplo:

```php
public function store(StorePropertyRequest $request): RedirectResponse
{
    $this->propertyService->create(
        $request->validated(),
        $request->user()
    );

    return redirect()
        ->route('properties.index')
        ->with('success', 'Propiedad creada correctamente.');
}
```

---

### FormRequests

Las validaciones deben ir preferentemente en `app/Http/Requests`.

Ejemplo:

```php
class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Property::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'property_type' => ['required', 'string'],
            'operation_type' => ['required', 'string'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'city_id' => ['required', 'exists:cities,id'],
        ];
    }
}
```

---

### Services

La lógica de negocio debe ir en `app/Services`.

Ejemplos:

```txt
PropertyService
PublicationService
SearchPreferenceService
ContactRequestService
VisitRequestService
```

Ejemplo:

```php
class PropertyService
{
    public function create(array $data, User $user): Property
    {
        return Property::create([
            ...$data,
            'user_id' => $user->id,
        ]);
    }

    public function update(Property $property, array $data): Property
    {
        $property->update($data);

        return $property;
    }
}
```

---

## 5.4. Modelos

Cada modelo debe definir explícitamente:

- `$fillable`
- `$casts`
- Relaciones
- Scopes reutilizables
- SoftDeletes cuando corresponda

No usar:

```php
protected $guarded = [];
```

Ejemplo:

```php
class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'city_id',
        'title',
        'description',
        'property_type',
        'operation_type',
        'price',
        'currency',
        'address',
        'latitude',
        'longitude',
        'active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }
}
```

---

## 5.5. Persistencia

- Migraciones atómicas y reversibles.
- Uso de `uuid` en entidades principales de dominio si el proyecto ya lo define así.
- `users.id` puede mantenerse como `bigint` autoincremental.
- Seeders solo para datos de entorno local o catálogos iniciales.
- Nunca guardar información sensible en seeders.
- En desarrollo sin producción, se puede modificar una migración existente y ejecutar `migrate:fresh --seed`.
- En producción, crear migraciones incrementales.

---

## 5.6. Consultas y performance

- Usar Eloquent ORM para lectura y escritura.
- Evitar SQL crudo salvo casos justificados.
- Usar eager loading con `with()` para evitar N+1.
- Paginar siempre los listados.
- Usar scopes para filtros reutilizables.
- No usar `get()` sin límite en pantallas de listado.

Ejemplo:

```php
$query = Property::query()
    ->with(['city', 'user', 'publication'])
    ->when($request->search, fn ($query, $search) => $query->search($search))
    ->when($request->property_type, fn ($query, $type) => $query->where('property_type', $type))
    ->latest()
    ->paginate(15)
    ->withQueryString();
```

---

## 5.7. Scopes

Filtros comunes deben ir como scopes en el modelo.

Ejemplo:

```php
public function scopeActive(Builder $query): Builder
{
    return $query->where('active', true);
}

public function scopeSearch(Builder $query, string $term): Builder
{
    return $query->where(function (Builder $query) use ($term) {
        $query->where('title', 'ILIKE', "%{$term}%")
            ->orWhere('description', 'ILIKE', "%{$term}%")
            ->orWhere('address', 'ILIKE', "%{$term}%");
    });
}
```

---

## 5.8. Autorización y roles

Usar **spatie/laravel-permission** para roles y permisos.

Roles base:

```txt
admin
owner
agency
interested
```

Reglas:

- Usar `HasRoles` en el modelo `User`.
- Usar Policies por recurso.
- Usar middleware `permission:` o `role:` cuando corresponda.
- No escribir lógica de autorización manual dentro del controller.

Correcto:

```php
$this->authorize('update', $property);
```

Incorrecto:

```php
if (auth()->user()->role !== 'admin') {
    abort(403);
}
```

---

## 5.9. Rutas

Usar `Route::resource()` cuando aplique.

Ejemplo:

```php
Route::resource('properties', PropertyController::class);

Route::patch('publications/{publication}/approve', [PublicationController::class, 'approve'])
    ->name('publications.approve');

Route::patch('publications/{publication}/reject', [PublicationController::class, 'reject'])
    ->name('publications.reject');
```

---

## 5.10. Respuestas

### Inertia

```php
return Inertia::render('Properties/Index', [
    'properties' => $properties,
    'filters' => $request->only([
        'search',
        'property_type',
        'operation_type',
        'city_id',
        'min_price',
        'max_price',
    ]),
]);
```

### Redirects con toast

```php
return redirect()
    ->route('properties.index')
    ->with('success', 'Propiedad creada correctamente.');

return back()
    ->with('success', 'Publicación aprobada correctamente.');
```

### JSON

```php
return response()->json([
    'data' => $result,
]);

return response()->json([
    'error' => 'No se pudo procesar la solicitud.',
], 422);
```

---

## 5.11. Events y Listeners

Acciones secundarias deben ir en events/listeners.

Ejemplos:

```txt
PublicationApproved
ContactRequestCreated
VisitRequested
SearchPreferenceMatched
```

Ejemplo:

```php
event(new ContactRequestCreated($contactRequest));
```

Usar events/listeners para:

- Envío de emails.
- Notificaciones.
- Logs externos.
- Acciones posteriores a una aprobación o solicitud.

---

## 5.12. Logs y actividad

Usar logs de actividad para operaciones importantes:

```txt
Creación de propiedad
Edición de propiedad
Aprobación de publicación
Rechazo de publicación
Solicitud de contacto
Solicitud de visita
Cambio de rol de usuario
```

No usar `Log::info()` como parte de la lógica de negocio. Solo para debugging temporal.

---

# 6. Código limpio

## 6.1. Reglas generales

- Nombres claros y descriptivos.
- Funciones pequeñas y con una única responsabilidad.
- Evitar duplicación de lógica.
- Evitar soluciones ad-hoc.
- Priorizar legibilidad.
- Mantener consistencia entre frontend y backend.
- Actualizar tipos TypeScript cuando cambien props de Inertia.
- Pequeños commits y cambios enfocados.

---

## 6.2. No hacer

- No usar `any` sin justificación.
- No usar `$request->all()` para crear o actualizar modelos.
- No poner lógica de negocio en controllers.
- No consultar relaciones en bucles sin eager loading.
- No crear componentes visuales duplicados.
- No hardcodear colores o estilos que ya existan como tokens.
- No agregar pantallas o flujos que contradigan `BuProp-prototipo.pen`.

---

## 7. Referencias

- Prototipo visual principal: `BuProp-prototipo.pen`
- Documentación shadcn/ui: https://ui.shadcn.com/docs/components
- Laravel: https://laravel.com/docs
- Inertia.js: https://inertiajs.com/
- Spatie Laravel Permission: https://spatie.be/docs/laravel-permission
