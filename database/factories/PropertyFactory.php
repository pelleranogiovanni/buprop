<?php

namespace Database\Factories;

use App\Models\City;
use App\Models\Neighborhood;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Property>
 */
class PropertyFactory extends Factory
{
    public function definition(): array
    {
        $propertyTypes = ['apartment', 'house', 'commercial'];
        $propertyType = fake()->randomElement($propertyTypes);
        
        $bedrooms = $propertyType === 'commercial' ? 0 : fake()->numberBetween(1, 4);
        $bathrooms = $propertyType === 'commercial' ? fake()->numberBetween(1, 2) : fake()->numberBetween(1, 3);
        $rooms = $propertyType === 'commercial' ? fake()->numberBetween(1, 5) : $bedrooms + fake()->numberBetween(1, 3);
        
        $coveredM2 = fake()->numberBetween(45, 200);
        $totalM2 = $propertyType === 'apartment' ? $coveredM2 : $coveredM2 + fake()->numberBetween(0, 150);
        
        return [
            'owner_id' => User::role('owner')->inRandomOrder()->first()?->id ?? User::factory()->create(),
            'city_id' => City::inRandomOrder()->first()?->city_id,
            'neighborhood_id' => Neighborhood::inRandomOrder()->first()?->neighborhood_id,
            'property_type' => $propertyType,
            'title' => $this->generateTitle($propertyType, $bedrooms),
            'description' => $this->generateDescription($propertyType, $bedrooms, $bathrooms),
            'address' => fake()->streetAddress(),
            'bedrooms' => $bedrooms,
            'bathrooms' => $bathrooms,
            'rooms' => $rooms,
            'covered_m2' => $coveredM2,
            'total_m2' => $totalM2,
            'latitude' => fake()->latitude(-28, -26),
            'longitude' => fake()->longitude(-61, -58),
            'formatted_address' => fake()->address(),
            'location_precision' => fake()->numberBetween(1, 5),
            'map_url' => fake()->optional(0.3)->url(),
            'has_patio' => $propertyType !== 'apartment' ? fake()->boolean(70) : false,
            'has_garage' => fake()->boolean(60),
            'amenities' => $this->generateAmenities($propertyType),
        ];
    }

    private function generateTitle(string $propertyType, int $bedrooms): string
    {
        $titles = [
            'apartment' => [
                "Departamento de {$bedrooms} ambientes luminoso",
                "Moderno departamento en excelente ubicación",
                "Acogedor {$bedrooms} ambientes con balcón",
                "Departamento renovado listo para habitar",
            ],
            'house' => [
                "Casa familiar de {$bedrooms} dormitorios",
                "Hermosa casa con patio y garage",
                "Casa en excelente estado general",
                "Amplia casa ideal para familias",
            ],
            'commercial' => [
                "Local comercial en zona céntrica",
                "Amplio local sobre avenida principal",
                "Espacio comercial con excelente ubicación",
                "Local apto para cualquier rubro",
            ],
        ];

        return fake()->randomElement($titles[$propertyType]);
    }

    private function generateDescription(string $propertyType, int $bedrooms, int $bathrooms): string
    {
        $descriptions = [
            'apartment' => "Hermoso departamento de {$bedrooms} dormitorios y {$bathrooms} baños, muy luminoso y con excelente ubicación. Ideal para " . 
                          (($bedrooms > 2) ? 'familias' : 'parejas o personas solas') . '. ' . fake()->sentence(),
            'house' => "Amplia casa de {$bedrooms} dormitorios con {$bathrooms} baños, patio y muy buena orientación. " .
                      "Perfecta para familias que buscan comodidad y espacio. " . fake()->sentence(),
            'commercial' => "Excelente local comercial ideal para desarrollar cualquier actividad comercial. " .
                           "Muy buena ubicación y gran potencial. " . fake()->sentence(),
        ];

        return $descriptions[$propertyType];
    }

    private function generateAmenities(string $propertyType): array
    {
        $baseAmenities = [
            'apartment' => ['aire_acondicionado', 'balcon', 'cocina_equipada', 'lavarropas', 'amoblado', 'ascensor', 'sum'],
            'house' => ['garage', 'patio', 'parrilla', 'aire_acondicionado', 'piscina', 'quincho', 'jardin'],
            'commercial' => ['aire_acondicionado', 'vidriera', 'deposito', 'oficina', 'carga_descarga', 'alarma'],
        ];

        $amenities = fake()->randomElements($baseAmenities[$propertyType], fake()->numberBetween(2, 5));
        return array_values(array_unique($amenities));
    }

    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'owner_id' => $user->id,
        ]);
    }

    public function inCity(string $cityId): static
    {
        return $this->state(fn (array $attributes) => [
            'city_id' => $cityId,
        ]);
    }
}