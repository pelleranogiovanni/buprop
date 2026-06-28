<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\Neighborhood;
use App\Services\ListingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    public function __construct(
        private readonly ListingService $listingService
    ) {}

    public function index(Request $request): Response
    {
        $filters = $request->only([
            'operation_type',
            'property_type',
            'neighborhood_id',
            'min_price',
            'max_price',
            'bedrooms',
            'q',
            'sort',
        ]);

        $features = array_values(array_filter((array) $request->input('features', [])));
        if (!empty($features)) {
            $filters['features'] = $features;
        }

        return Inertia::render('Properties/Index', [
            'listings'      => $this->listingService->search($filters),
            'neighborhoods' => Neighborhood::getByCity('Villa Ángela'),
            'filters'       => $filters,
            'auth'          => [
                'user' => auth()->check() ? auth()->user()->load('roles') : null,
            ],
        ]);
    }

    public function show(string $listingId): Response
    {
        $listing = Listing::with([
            'property.city',
            'property.neighborhood',
            'property.owner',
            'property.images',
            'publisher.roles',
        ])
            ->where('listing_id', $listingId)
            ->where('availability_status', 'available')
            ->where('moderation_status', 'approved')
            ->firstOrFail();

        $publisher = $listing->publisher;
        $isAgency = $publisher->hasRole('agency');

        return Inertia::render('PropertyDetail', [
            'property' => [
                'listing_id'        => $listing->listing_id,
                'operation_type'    => $listing->operation_type,
                'price'             => $listing->price,
                'currency'          => $listing->currency,
                'availability_status' => $listing->availability_status,
                'allow_messages'    => $listing->allow_messages,
                'requirements'      => $listing->requirements,
                'conditions'        => $listing->conditions,
                'allows_pets'       => $listing->allows_pets,
                'allows_children'   => $listing->allows_children,
                'available_from'    => $listing->available_from,
                'published_at'      => $listing->published_at,
                'updated_at'        => $listing->updated_at,
                'property_type'     => $listing->property->property_type,
                'title'             => $listing->property->title,
                'description'       => $listing->property->description,
                'address'           => $listing->property->address,
                'bedrooms'          => $listing->property->bedrooms,
                'bathrooms'         => $listing->property->bathrooms,
                'rooms'             => $listing->property->rooms,
                'covered_m2'        => $listing->property->covered_m2,
                'total_m2'          => $listing->property->total_m2,
                'has_patio'         => $listing->property->has_patio,
                'has_garage'        => $listing->property->has_garage,
                'amenities'         => $listing->property->amenities,
                'city_name'         => $listing->property->city->name,
                'neighborhood_name' => $listing->property->neighborhood?->name,
                'owner_name'        => $listing->property->owner->name,
                'publisher_name'    => $isAgency && $publisher->business_name
                    ? $publisher->business_name
                    : $publisher->name,
                'publisher_type'    => $isAgency ? 'agency' : 'owner',
                'publisher_verified' => $publisher->verification_status === 'verified',
                'images'            => $listing->property->images
                    ->map(fn ($image) => [
                        'url'        => $image->url,
                        'is_cover'   => $image->is_cover,
                        'sort_order' => $image->sort_order,
                    ])
                    ->sortBy('sort_order')
                    ->values()
                    ->toArray(),
            ],
            'similarProperties' => $this->listingService->getSimilar($listing, 3),
        ]);
    }
}
