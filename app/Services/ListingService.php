<?php

namespace App\Services;

use App\Models\Listing;
use Illuminate\Pagination\LengthAwarePaginator;

class ListingService
{
    public function getFeatured(int $limit = 3): array
    {
        return Listing::with([
            'property.city',
            'property.neighborhood',
            'property.coverImage',
            'publisher:id,name',
        ])
            ->available()
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn (Listing $listing) => $this->formatListing($listing))
            ->values()
            ->toArray();
    }

    public function search(array $filters): LengthAwarePaginator
    {
        return Listing::getAvailableListings($filters);
    }

    private function formatListing(Listing $listing): array
    {
        return [
            'listing_id'        => $listing->listing_id,
            'operation_type'    => $listing->operation_type,
            'price'             => $listing->price,
            'currency'          => $listing->currency,
            'property_type'     => $listing->property->property_type,
            'address'           => $listing->property->address,
            'bedrooms'          => $listing->property->bedrooms,
            'bathrooms'         => $listing->property->bathrooms,
            'covered_m2'        => $listing->property->covered_m2,
            'amenities'         => $listing->property->amenities,
            'city_name'         => $listing->property->city->name,
            'neighborhood_name' => $listing->property->neighborhood?->name,
            'publisher_name'    => $listing->publisher->name,
            'cover_image'       => $listing->property->coverImage?->url,
        ];
    }
}
