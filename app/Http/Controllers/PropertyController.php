<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Listing;

class PropertyController extends Controller
{
    public function show(string $listingId)
    {
        $listing = Listing::with([
            'property.city',
            'property.neighborhood', 
            'property.owner',
            'publisher'
        ])
        ->where('listing_id', $listingId)
        ->where('availability_status', 'available')
        ->where('moderation_status', 'approved')
        ->firstOrFail();

        $propertyData = [
            'listing_id' => $listing->listing_id,
            'operation_type' => $listing->operation_type,
            'price' => $listing->price,
            'currency' => $listing->currency,
            'requirements' => $listing->requirements,
            'available_from' => $listing->available_from,
            'property_type' => $listing->property->property_type,
            'address' => $listing->property->address,
            'bedrooms' => $listing->property->bedrooms,
            'bathrooms' => $listing->property->bathrooms,
            'rooms' => $listing->property->rooms,
            'covered_m2' => $listing->property->covered_m2,
            'total_m2' => $listing->property->total_m2,
            'amenities' => $listing->property->amenities,
            'city_name' => $listing->property->city->name,
            'neighborhood_name' => $listing->property->neighborhood?->name,
            'owner_name' => $listing->property->owner->name,
            'publisher_name' => $listing->publisher->name,
            'publisher_phone' => $listing->publisher->phone,
        ];

        return Inertia::render('PropertyDetail', [
            'property' => $propertyData
        ]);
    }
}