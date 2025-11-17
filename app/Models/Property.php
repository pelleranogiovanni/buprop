<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $primaryKey = 'property_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'property_id',
        'owner_id',
        'property_type',
        'address',
        'city_id',
        'neighborhood_id',
        'bedrooms',
        'bathrooms',
        'rooms',
        'covered_m2',
        'total_m2',
        'amenities',
    ];

    protected $casts = [
        'amenities' => 'array',
        'covered_m2' => 'decimal:2',
        'total_m2' => 'decimal:2',
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

    public function coverImage()
    {
        return $this->hasOne(PropertyImage::class, 'property_id', 'property_id')
                    ->where('is_cover', true);
    }
}