<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Property extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'properties';
    protected $primaryKey = 'property_id';

    protected $fillable = [
        'owner_id',
        'city_id',
        'neighborhood_id',
        'property_type',
        'title',
        'description',
        'address',
        'bedrooms',
        'bathrooms',
        'rooms',
        'covered_m2',
        'total_m2',
        'latitude',
        'longitude',
        'formatted_address',
        'location_precision',
        'map_url',
        'has_patio',
        'has_garage',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'covered_m2' => 'decimal:2',
        'total_m2' => 'decimal:2',
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
        'has_patio' => 'boolean',
        'has_garage' => 'boolean',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class, 'neighborhood_id', 'neighborhood_id');
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'property_id', 'property_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class, 'property_id', 'property_id');
    }

    public function coverImage(): HasOne
    {
        return $this->hasOne(PropertyImage::class, 'property_id', 'property_id')
                    ->where('is_cover', true);
    }
}