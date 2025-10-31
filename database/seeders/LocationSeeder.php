<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        // Argentina
        $countryId = Str::uuid();
        DB::table('countries')->insert([
            'country_id' => $countryId,
            'name' => 'Argentina',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Provincia del Chaco
        $provinceId = Str::uuid();
        DB::table('provinces')->insert([
            'province_id' => $provinceId,
            'country_id' => $countryId,
            'name' => 'Chaco',
            'code' => 'CC',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Ciudades del Chaco
        $cities = [
            ['name' => 'Resistencia', 'lat' => -27.4606, 'lng' => -58.9837],
            ['name' => 'Barranqueras', 'lat' => -27.4833, 'lng' => -58.9333],
            ['name' => 'Fontana', 'lat' => -27.4167, 'lng' => -58.9167],
            ['name' => 'Puerto Vilelas', 'lat' => -27.5167, 'lng' => -58.9333],
            ['name' => 'Presidencia Roque Sáenz Peña', 'lat' => -26.7833, 'lng' => -60.4333],
            ['name' => 'Villa Ángela', 'lat' => -27.5667, 'lng' => -60.7167],
            ['name' => 'Charata', 'lat' => -27.2167, 'lng' => -61.1833],
            ['name' => 'General José de San Martín', 'lat' => -26.5333, 'lng' => -59.3333],
            ['name' => 'Machagai', 'lat' => -26.9333, 'lng' => -60.0500],
            ['name' => 'Quitilipi', 'lat' => -26.8667, 'lng' => -60.2167],
        ];

        $cityIds = [];
        foreach ($cities as $city) {
            $cityId = Str::uuid();
            $cityIds[] = $cityId;
            DB::table('cities')->insert([
                'city_id' => $cityId,
                'province_id' => $provinceId,
                'name' => $city['name'],
                'latitude' => $city['lat'],
                'longitude' => $city['lng'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Barrios para Resistencia
        $neighborhoods = [
            'Centro',
            'Villa Don Alberto',
            'Barrio Norte',
            'Villa Libertad',
            'Barrio Güemes',
            'Villa San Martín',
            'Barrio Toba',
            'Villa Río Negro',
        ];

        foreach ($neighborhoods as $neighborhood) {
            DB::table('neighborhoods')->insert([
                'neighborhood_id' => Str::uuid(),
                'city_id' => $cityIds[0], // Resistencia
                'name' => $neighborhood,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}