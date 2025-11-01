<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Listing extends Model
{
    protected $primaryKey = 'listing_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'listing_id',
        'property_id',
        'publisher_id',
        'operation_type',
        'price',
        'currency',
        'availability_status',
        'moderation_status',
        'requirements',
        'available_from',
        'allow_messages',
        'published_at',
    ];

    protected $casts = [
        'available_from' => 'date',
        'published_at' => 'datetime',
        'allow_messages' => 'boolean',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id', 'property_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'publisher_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available')
                    ->where('moderation_status', 'approved');
    }

    public function scopeWithFilters($query, array $filters)
    {
        return $query->when($filters['operation_type'] ?? null, function ($query, $operationType) {
                return $query->where('operation_type', $operationType);
            })
            ->when($filters['min_price'] ?? null, function ($query, $minPrice) {
                return $query->where('price', '>=', $minPrice);
            })
            ->when($filters['max_price'] ?? null, function ($query, $maxPrice) {
                return $query->where('price', '<=', $maxPrice);
            });
    }

    public static function getAvailableListings(array $filters = [])
    {
        $query = self::with(['property.city', 'property.neighborhood', 'publisher:id,name'])
            ->available()
            ->withFilters($filters);
            
        // Filtros de property
        if (!empty($filters['property_type'])) {
            $query->whereHas('property', function ($q) use ($filters) {
                $q->where('property_type', $filters['property_type']);
            });
        }
        
        if (!empty($filters['neighborhood_id']) && $filters['neighborhood_id'] !== 'all') {
            $query->whereHas('property', function ($q) use ($filters) {
                $q->where('neighborhood_id', $filters['neighborhood_id']);
            });
        }
        
        if (!empty($filters['bedrooms']) && $filters['bedrooms'] !== 'all') {
            $query->whereHas('property', function ($q) use ($filters) {
                $q->where('bedrooms', '=', $filters['bedrooms']);
            });
        }
        
        $listings = $query->orderBy('created_at', 'desc')->paginate(8);
        
        $listings->through(function ($listing) {
            return [
                'listing_id' => $listing->listing_id,
                'operation_type' => $listing->operation_type,
                'price' => $listing->price,
                'currency' => $listing->currency,
                'property_type' => $listing->property->property_type,
                'address' => $listing->property->address,
                'bedrooms' => $listing->property->bedrooms,
                'bathrooms' => $listing->property->bathrooms,
                'covered_m2' => $listing->property->covered_m2,
                'amenities' => $listing->property->amenities,
                'city_name' => $listing->property->city->name,
                'neighborhood_name' => $listing->property->neighborhood?->name,
                'publisher_name' => $listing->publisher->name,
            ];
        });
        
        return $listings;
    }
}