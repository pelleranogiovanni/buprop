<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Neighborhood extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'neighborhoods';
    protected $primaryKey = 'neighborhood_id';

    protected $fillable = [
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

    public function searchPreferences(): HasMany
    {
        return $this->hasMany(SearchPreference::class, 'neighborhood_id', 'neighborhood_id');
    }

    public static function getByCity(string $cityName)
    {
        return self::whereHas('city', function ($query) use ($cityName) {
            $query->where('name', $cityName);
        })->orderBy('name')->get(['neighborhood_id', 'name']);
    }
}