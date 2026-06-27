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
        ]);

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
            'publisher',
        ])
            ->where('listing_id', $listingId)
            ->where('availability_status', 'available')
            ->where('moderation_status', 'approved')
            ->firstOrFail();

        return Inertia::render('PropertyDetail', [
            'property' => [
                'listing_id'       => $listing->listing_id,
                'operation_type'   => $listing->operation_type,
                'price'            => $listing->price,
                'currency'         => $listing->currency,
                'requirements'     => $listing->requirements,
                'available_from'   => $listing->available_from,
                'property_type'    => $listing->property->property_type,
                'address'          => $listing->property->address,
                'bedrooms'         => $listing->property->bedrooms,
                'bathrooms'        => $listing->property->bathrooms,
                'rooms'            => $listing->property->rooms,
                'covered_m2'       => $listing->property->covered_m2,
                'total_m2'         => $listing->property->total_m2,
                'amenities'        => $listing->property->amenities,
                'city_name'        => $listing->property->city->name,
                'neighborhood_name'=> $listing->property->neighborhood?->name,
                'owner_name'       => $listing->property->owner->name,
                'publisher_name'   => $listing->publisher->name,
                'publisher_phone'  => $listing->publisher->phone,
                'images'           => $listing->property->images
                    ->map(fn ($image) => [
                        'url'        => $image->url,
                        'is_cover'   => $image->is_cover,
                        'sort_order' => $image->sort_order,
                    ])
                    ->sortBy('sort_order')
                    ->values()
                    ->toArray(),
            ],
        ]);
    }
}
