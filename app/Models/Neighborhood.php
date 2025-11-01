<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Neighborhood extends Model
{
    protected $primaryKey = 'neighborhood_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'neighborhood_id',
        'city_id',
        'name',
    ];

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'neighborhood_id', 'neighborhood_id');
    }

    public static function getByCity(string $cityName)
    {
        return self::whereHas('city', function ($query) use ($cityName) {
            $query->where('name', $cityName);
        })->orderBy('name')->get(['neighborhood_id', 'name']);
    }
}