<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class City extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'cities';
    protected $primaryKey = 'city_id';

    protected $fillable = [
        'province_id',
        'name',
        'latitude',
        'longitude',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:6',
            'longitude' => 'decimal:6',
        ];
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id', 'province_id');
    }

    public function neighborhoods(): HasMany
    {
        return $this->hasMany(Neighborhood::class, 'city_id', 'city_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'city_id', 'city_id');
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'city_id', 'city_id');
    }

    public function searchPreferences(): HasMany
    {
        return $this->hasMany(SearchPreference::class, 'city_id', 'city_id');
    }
}