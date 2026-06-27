<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Listing>
 */
class ListingFactory extends Factory
{
    public function definition(): array
    {
        $operationType = fake()->randomElement(['rent', 'sale']);
        $propertyType = fake()->randomElement(['apartment', 'house', 'commercial']);
        
        return [
            'property_id' => Property::factory(),
            'publisher_id' => User::whereHas('roles', function($q) {
                $q->whereIn('name', ['owner', 'agency']);
            })->inRandomOrder()->first()?->id ?? User::factory()->create(),
            'operation_type' => $operationType,
            'price' => $this->generatePrice($operationType, $propertyType),
            'currency' => 'ARS',
            'availability_status' => fake()->randomElement(['available', 'reserved', 'rented', 'sold']),
            'moderation_status' => fake()->randomElement(['pending', 'approved', 'rejected']),
            'requirements' => $this->generateRequirements($operationType),
            'conditions' => $this->generateConditions($operationType),
            'allows_pets' => fake()->boolean(40),
            'allows_children' => fake()->boolean(80),
            'available_from' => fake()->dateTimeBetween('now', '+2 months'),
            'allow_messages' => true,
            'published_at' => fake()->optional(0.8)->dateTimeBetween('-1 month', 'now'),
            'rejected_at' => null,
        ];
    }

    private function generatePrice(string $operationType, string $propertyType): float
    {
        if ($operationType === 'rent') {
            $ranges = [
                'apartment' => [50000, 120000],
                'house' => [70000, 150000], 
                'commercial' => [80000, 250000],
            ];
        } else {
            $ranges = [
                'apartment' => [8000000, 18000000],
                'house' => [12000000, 35000000],
                'commercial' => [15000000, 50000000],
            ];
        }

        return fake()->numberBetween($ranges[$propertyType][0], $ranges[$propertyType][1]);
    }

    private function generateRequirements(string $operationType): string
    {
        if ($operationType === 'rent') {
            $requirements = [
                'Recibo de sueldo, garantía propietaria',
                'Ingresos demostrables, garantía propietaria o seguro de caución',
                'Garantía propietaria excluyente, referencias comerciales',
                'Documentación completa, ingresos en relación',
            ];
        } else {
            $requirements = [
                'Documentación completa, seña del 30%',
                'Apto crédito hipotecario, documentación al día',
                'Escritura lista, financiación disponible',
                'Venta directa, documentación en regla',
            ];
        }

        return fake()->randomElement($requirements);
    }

    private function generateConditions(string $operationType): ?string
    {
        $conditions = [
            'No fumadores. Expensas incluidas.',
            'Se admiten mascotas pequeñas.',
            'Inmueble en excelente estado.',
            'Referencias comerciales excluyentes.',
            'Solo personas responsables.',
            'Todos los servicios incluidos.',
            null, // Some listings may not have conditions
        ];

        return fake()->randomElement($conditions);
    }

    public function forProperty(Property $property): static
    {
        return $this->state(fn (array $attributes) => [
            'property_id' => $property->property_id,
        ]);
    }

    public function rent(): static
    {
        return $this->state(fn (array $attributes) => [
            'operation_type' => 'rent',
            'price' => fake()->numberBetween(50000, 150000),
        ]);
    }

    public function sale(): static
    {
        return $this->state(fn (array $attributes) => [
            'operation_type' => 'sale', 
            'price' => fake()->numberBetween(8000000, 35000000),
        ]);
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'moderation_status' => 'approved',
            'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    public function available(): static
    {
        return $this->state(fn (array $attributes) => [
            'availability_status' => 'available',
            'moderation_status' => 'approved',
            'published_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }
}