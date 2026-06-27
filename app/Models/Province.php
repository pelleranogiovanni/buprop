<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Province extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'provinces';
    protected $primaryKey = 'province_id';

    protected $fillable = [
        'country_id',
        'name',
        'code',
    ];

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id', 'country_id');
    }

    public function cities(): HasMany
    {
        return $this->hasMany(City::class, 'province_id', 'province_id');
    }
}