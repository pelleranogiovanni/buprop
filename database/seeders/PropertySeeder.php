<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::role('owner')->first();
        $agency = User::role('agency')->first();
        $villaAngelaCityId = DB::table('cities')->where('name', 'Villa Ángela')->first()->city_id;
        $neighborhoods = DB::table('neighborhoods')
            ->join('cities', 'neighborhoods.city_id', '=', 'cities.city_id')
            ->where('cities.name', 'Villa Ángela')
            ->pluck('neighborhoods.neighborhood_id', 'neighborhoods.name');

        // 10 Propiedades de ejemplo
        $properties = [
            [
                'property_type' => 'apartment',
                'address' => 'Av. San Martín 1234',
                'neighborhood' => 'Centro',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'rooms' => 3,
                'covered_m2' => 65.50,
                'total_m2' => 65.50,
                'amenities' => json_encode(['aire_acondicionado', 'balcon', 'cocina_equipada']),
                'operation' => 'rent',
                'price' => 85000,
                'publisher' => 'owner',
            ],
            [
                'property_type' => 'house',
                'address' => 'Calle Belgrano 567',
                'neighborhood' => 'Barrio Norte',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'rooms' => 5,
                'covered_m2' => 120.00,
                'total_m2' => 200.00,
                'amenities' => json_encode(['garage', 'patio', 'parrilla', 'aire_acondicionado']),
                'operation' => 'sale',
                'price' => 15000000,
                'publisher' => 'agency',
            ],
            [
                'property_type' => 'apartment',
                'address' => 'Calle Sarmiento 890',
                'neighborhood' => 'Centro',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rooms' => 2,
                'covered_m2' => 45.00,
                'total_m2' => 45.00,
                'amenities' => json_encode(['aire_acondicionado', 'amoblado']),
                'operation' => 'rent',
                'price' => 65000,
                'publisher' => 'owner',
            ],
            [
                'property_type' => 'house',
                'address' => 'Av. Libertad 445',
                'neighborhood' => 'Villa Progreso',
                'bedrooms' => 4,
                'bathrooms' => 3,
                'rooms' => 6,
                'covered_m2' => 180.00,
                'total_m2' => 350.00,
                'amenities' => json_encode(['garage', 'piscina', 'quincho', 'aire_acondicionado']),
                'operation' => 'sale',
                'price' => 25000000,
                'publisher' => 'agency',
            ],
            [
                'property_type' => 'apartment',
                'address' => 'Calle Mitre 223',
                'neighborhood' => 'Barrio Sur',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'rooms' => 3,
                'covered_m2' => 70.00,
                'total_m2' => 70.00,
                'amenities' => json_encode(['balcon', 'cocina_equipada', 'lavarropas']),
                'operation' => 'rent',
                'price' => 75000,
                'publisher' => 'owner',
            ],
            [
                'property_type' => 'commercial',
                'address' => 'Av. Principal 100',
                'neighborhood' => 'Centro',
                'bedrooms' => 0,
                'bathrooms' => 2,
                'rooms' => 3,
                'covered_m2' => 90.00,
                'total_m2' => 90.00,
                'amenities' => json_encode(['aire_acondicionado', 'vidriera', 'deposito']),
                'operation' => 'rent',
                'price' => 120000,
                'publisher' => 'agency',
            ],
            [
                'property_type' => 'house',
                'address' => 'Calle Moreno 778',
                'neighborhood' => 'Barrio Obrero',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'rooms' => 4,
                'covered_m2' => 85.00,
                'total_m2' => 150.00,
                'amenities' => json_encode(['patio', 'garage', 'parrilla']),
                'operation' => 'rent',
                'price' => 70000,
                'publisher' => 'owner',
            ],
            [
                'property_type' => 'apartment',
                'address' => 'Av. Independencia 556',
                'neighborhood' => 'Villa Nueva',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'rooms' => 4,
                'covered_m2' => 95.00,
                'total_m2' => 95.00,
                'amenities' => json_encode(['aire_acondicionado', 'balcon', 'sum', 'ascensor']),
                'operation' => 'sale',
                'price' => 12000000,
                'publisher' => 'agency',
            ],
            [
                'property_type' => 'house',
                'address' => 'Calle Rivadavia 334',
                'neighborhood' => 'Villa Esperanza',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'rooms' => 5,
                'covered_m2' => 110.00,
                'total_m2' => 220.00,
                'amenities' => json_encode(['garage', 'patio', 'quincho', 'aire_acondicionado']),
                'operation' => 'rent',
                'price' => 95000,
                'publisher' => 'owner',
            ],
            [
                'property_type' => 'commercial',
                'address' => 'Av. San Martín 889',
                'neighborhood' => 'Barrio Industrial',
                'bedrooms' => 0,
                'bathrooms' => 1,
                'rooms' => 2,
                'covered_m2' => 150.00,
                'total_m2' => 150.00,
                'amenities' => json_encode(['deposito', 'carga_descarga', 'oficina']),
                'operation' => 'rent',
                'price' => 180000,
                'publisher' => 'agency',
            ],
        ];

        foreach ($properties as $property) {
            $propertyId = Str::uuid();
            $publisherUser = $property['publisher'] === 'owner' ? $owner : $agency;
            
            DB::table('properties')->insert([
                'property_id' => $propertyId,
                'owner_id' => $owner->id,
                'property_type' => $property['property_type'],
                'address' => $property['address'],
                'city_id' => $villaAngelaCityId,
                'neighborhood_id' => $neighborhoods[$property['neighborhood']] ?? null,
                'bedrooms' => $property['bedrooms'],
                'bathrooms' => $property['bathrooms'],
                'rooms' => $property['rooms'],
                'covered_m2' => $property['covered_m2'],
                'total_m2' => $property['total_m2'],
                'amenities' => $property['amenities'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Crear listing para cada propiedad
            DB::table('listings')->insert([
                'listing_id' => Str::uuid(),
                'property_id' => $propertyId,
                'publisher_id' => $publisherUser->id,
                'operation_type' => $property['operation'],
                'price' => $property['price'],
                'currency' => 'ARS',
                'availability_status' => 'available',
                'moderation_status' => 'approved',
                'requirements' => $property['operation'] === 'rent' 
                    ? 'Recibo de sueldo, garantía propietaria' 
                    : 'Documentación completa, seña del 30%',
                'available_from' => now()->addDays(rand(1, 30)),
                'allow_messages' => true,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}