<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class SearchPreference extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'search_preferences';
    protected $primaryKey = 'search_preference_id';

    protected $fillable = [
        'user_id',
        'operation_type',
        'property_type',
        'city_id',
        'neighborhood_id',
        'min_price',
        'max_price',
        'currency',
        'min_rooms',
        'min_bedrooms',
        'min_bathrooms',
        'min_total_m2',
        'requires_pets_allowed',
        'requires_children_allowed',
        'needs_patio',
        'needs_garage',
        'desired_available_from',
        'has_income_proof',
        'has_guarantor',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'min_price' => 'decimal:2',
            'max_price' => 'decimal:2',
            'min_total_m2' => 'decimal:2',
            'requires_pets_allowed' => 'boolean',
            'requires_children_allowed' => 'boolean',
            'needs_patio' => 'boolean',
            'needs_garage' => 'boolean',
            'has_income_proof' => 'boolean',
            'has_guarantor' => 'boolean',
            'desired_available_from' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    public function neighborhood(): BelongsTo
    {
        return $this->belongsTo(Neighborhood::class, 'neighborhood_id', 'neighborhood_id');
    }
}