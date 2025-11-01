<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $primaryKey = 'city_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'city_id',
        'province_id',
        'name',
        'latitude',
        'longitude',
    ];

    public function neighborhoods(): HasMany
    {
        return $this->hasMany(Neighborhood::class, 'city_id', 'city_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'city_id', 'city_id');
    }
}