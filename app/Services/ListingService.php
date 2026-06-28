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
        $features = array_values(array_filter((array) ($filters['features'] ?? [])));

        return Listing::with([
            'property.city',
            'property.neighborhood',
            'property.coverImage',
            'publisher:id,name',
        ])
            ->available()
            ->withFilters($filters)
            ->withFeatures($features)
            ->withSort($filters['sort'] ?? null)
            ->paginate(8)
            ->through(fn (Listing $listing) => $this->formatListing($listing));
    }

    public function getSimilar(Listing $listing, int $limit = 3): array
    {
        $neighborhoodId = $listing->property->neighborhood_id;
        $propertyType = $listing->property->property_type;

        return Listing::with([
            'property.city',
            'property.neighborhood',
            'property.coverImage',
            'publisher:id,name',
        ])
            ->available()
            ->where('listing_id', '!=', $listing->listing_id)
            ->where('operation_type', $listing->operation_type)
            ->whereHas('property', function ($query) use ($neighborhoodId, $propertyType) {
                $query->where('neighborhood_id', $neighborhoodId)
                    ->orWhere('property_type', $propertyType);
            })
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(fn (Listing $similar) => $this->formatListing($similar))
            ->values()
            ->toArray();
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
