<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\ContactRequest;
use App\Models\Listing;
use App\Models\Property;
use App\Models\User;
use App\Models\VisitRequest;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Get Villa Ángela city for consistency
        $villaAngelaCityId = City::where('name', 'Villa Ángela')->first()->city_id;
        
        // Create additional users using factory
        $additionalOwners = User::factory(3)
            ->withCity($villaAngelaCityId)
            ->create()
            ->each(fn($user) => $user->assignRole('owner'));

        $additionalAgencies = User::factory(2)
            ->agency()
            ->withCity($villaAngelaCityId)
            ->create()
            ->each(fn($user) => $user->assignRole('agency'));

        $additionalTenants = User::factory(8)
            ->withCity($villaAngelaCityId)
            ->create()
            ->each(fn($user) => $user->assignRole('tenant'));

        // Create additional properties using factories
        $additionalProperties = collect();
        
        // Properties from additional owners
        $additionalOwners->each(function($owner) use (&$additionalProperties, $villaAngelaCityId) {
            $properties = Property::factory(rand(1, 3))
                ->forUser($owner)
                ->inCity($villaAngelaCityId)
                ->create();
            $additionalProperties = $additionalProperties->merge($properties);
        });

        // Properties from additional agencies
        $additionalAgencies->each(function($agency) use (&$additionalProperties, $villaAngelaCityId) {
            $properties = Property::factory(rand(2, 4))
                ->inCity($villaAngelaCityId)
                ->create();
            
            // Create listings published by the agency
            $properties->each(function($property) use ($agency) {
                Listing::factory()
                    ->forProperty($property)
                    ->available()
                    ->create(['publisher_id' => $agency->id]);
            });
            
            $additionalProperties = $additionalProperties->merge($properties);
        });

        // Create listings for properties without listings
        $propertiesWithoutListings = Property::whereDoesntHave('listings')->get();
        $propertiesWithoutListings->each(function($property) {
            Listing::factory()
                ->forProperty($property)
                ->available()
                ->create(['publisher_id' => $property->owner_id]);
        });

        // Generate contact requests from tenants
        $availableListings = Listing::available()->get();
        $tenants = User::role('tenant')->get();
        
        $tenants->take(12)->each(function($tenant) use ($availableListings) {
            // Each tenant contacts 1-3 listings
            $randomListings = $availableListings->random(rand(1, 3));
            
            $randomListings->each(function($listing) use ($tenant) {
                if (rand(1, 100) <= 70) { // 70% chance
                    ContactRequest::factory()
                        ->forListing($listing)
                        ->fromUser($tenant)
                        ->create();
                }
            });
        });

        // Generate visit requests
        $tenants->take(8)->each(function($tenant) use ($availableListings) {
            // Each tenant requests visits to 1-2 listings
            $randomListings = $availableListings->random(rand(1, 2));
            
            $randomListings->each(function($listing) use ($tenant) {
                if (rand(1, 100) <= 50) { // 50% chance
                    VisitRequest::factory()
                        ->forListing($listing)
                        ->fromUser($tenant)
                        ->create();
                }
            });
        });

        $this->command->info('Demo data created successfully!');
        $this->command->info('Total Users: ' . User::count());
        $this->command->info('Total Properties: ' . Property::count());
        $this->command->info('Total Listings: ' . Listing::count());
        $this->command->info('Total Contact Requests: ' . ContactRequest::count());
        $this->command->info('Total Visit Requests: ' . VisitRequest::count());
    }
}