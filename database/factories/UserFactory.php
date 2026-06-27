<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\City;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= 'password',
            'phone' => '+54 ' . fake()->numerify('### ####-####'),
            'city_id' => null, // Se asignará dinámicamente
            'birth_date' => fake()->dateTimeBetween('-65 years', '-18 years')->format('Y-m-d'),
            'occupation' => fake()->jobTitle(),
            'avatar_url' => null,
            'bio' => fake()->optional(0.6)->sentence(10),
            'business_name' => null,
            'tax_id' => null,
            'license_number' => null,
            'verification_document_url' => null,
            'verification_status' => 'pending',
            'is_active' => true,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Configure user as agency with business fields.
     */
    public function agency(): static
    {
        return $this->state(fn (array $attributes) => [
            'business_name' => fake()->company(),
            'tax_id' => '20-' . fake()->numerify('########') . '-9',
            'license_number' => 'CPI-' . fake()->numerify('######'),
            'verification_status' => fake()->randomElement(['pending', 'verified', 'rejected']),
            'occupation' => 'Corredor Inmobiliario',
        ]);
    }

    /**
     * Configure user with a specific city.
     */
    public function withCity(string $cityId): static
    {
        return $this->state(fn (array $attributes) => [
            'city_id' => $cityId,
        ]);
    }
}
