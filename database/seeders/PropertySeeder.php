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
        $villaAngelaCityId = DB::table('cities')->where('name', 'Villa Ángela')->first()->city_id;

        // Propiedades de ejemplo
        $properties = [
            [
                'property_type' => 'apartment',
                'address' => 'Av. San Martín 1234',
                'bedrooms' => 2,
                'bathrooms' => 1,
                'rooms' => 3,
                'covered_m2' => 65.50,
                'total_m2' => 65.50,
                'amenities' => json_encode(['aire_acondicionado', 'balcon', 'cocina_equipada']),
            ],
            [
                'property_type' => 'house',
                'address' => 'Calle Belgrano 567',
                'bedrooms' => 3,
                'bathrooms' => 2,
                'rooms' => 5,
                'covered_m2' => 120.00,
                'total_m2' => 200.00,
                'amenities' => json_encode(['garage', 'patio', 'parrilla', 'aire_acondicionado']),
            ],
            [
                'property_type' => 'apartment',
                'address' => 'Calle Sarmiento 890',
                'bedrooms' => 1,
                'bathrooms' => 1,
                'rooms' => 2,
                'covered_m2' => 45.00,
                'total_m2' => 45.00,
                'amenities' => json_encode(['aire_acondicionado', 'amoblado']),
            ],
        ];

        foreach ($properties as $property) {
            $propertyId = Str::uuid();
            DB::table('properties')->insert([
                'property_id' => $propertyId,
                'owner_id' => $owner->id,
                'property_type' => $property['property_type'],
                'address' => $property['address'],
                'city_id' => $villaAngelaCityId,
                'neighborhood_id' => null,
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
                'publisher_id' => $owner->id,
                'operation_type' => 'rent',
                'price' => rand(50000, 150000),
                'currency' => 'ARS',
                'availability_status' => 'available',
                'moderation_status' => 'approved',
                'requirements' => 'Recibo de sueldo, garantía propietaria',
                'available_from' => now()->addDays(rand(1, 30)),
                'allow_messages' => true,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}