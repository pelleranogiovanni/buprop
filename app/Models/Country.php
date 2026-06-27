<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Country extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'countries';
    protected $primaryKey = 'country_id';

    protected $fillable = [
        'name',
    ];

    public function provinces(): HasMany
    {
        return $this->hasMany(Province::class, 'country_id', 'country_id');
    }
}