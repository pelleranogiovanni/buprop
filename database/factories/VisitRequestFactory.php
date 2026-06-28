<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VisitRequest>
 */
class VisitRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'listing_id' => Listing::factory(),
            'requester_id' => User::role('tenant')->inRandomOrder()->first()?->id ?? User::factory()->create(),
            'preferred_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'preferred_time_slot' => fake()->randomElement(['morning', 'afternoon', 'evening']),
            'preferred_time' => fake()->optional()->randomElement(['10:00', '15:00', '18:00']),
            'alternative_date' => fake()->optional()->dateTimeBetween('+1 month', '+2 months')?->format('Y-m-d'),
            'comment' => fake()->optional()->sentence(),
            'contact_phone' => fake()->optional()->numerify('+54 9 3735 ######'),
            'status' => fake()->randomElement(['requested', 'scheduled', 'done', 'cancelled']),
        ];
    }

    public function forListing(Listing $listing): static
    {
        return $this->state(fn (array $attributes) => [
            'listing_id' => $listing->listing_id,
        ]);
    }

    public function fromUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'requester_id' => $user->id,
        ]);
    }

    public function scheduled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'scheduled',
        ]);
    }
}