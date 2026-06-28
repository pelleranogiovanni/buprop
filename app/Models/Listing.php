<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Listing extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'listings';
    protected $primaryKey = 'listing_id';

    protected $fillable = [
        'property_id',
        'publisher_id',
        'operation_type',
        'price',
        'currency',
        'availability_status',
        'moderation_status',
        'requirements',
        'conditions',
        'allows_pets',
        'allows_children',
        'available_from',
        'allow_messages',
        'published_at',
    ];

    protected $casts = [
        'available_from' => 'date',
        'published_at' => 'datetime',
        'rejected_at' => 'datetime',
        'allow_messages' => 'boolean',
        'allows_pets' => 'boolean',
        'allows_children' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class, 'property_id', 'property_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'publisher_id');
    }

    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class, 'listing_id', 'listing_id');
    }

    public function visitRequests(): HasMany
    {
        return $this->hasMany(VisitRequest::class, 'listing_id', 'listing_id');
    }

    public function moderationLogs(): HasMany
    {
        return $this->hasMany(ModerationLog::class, 'listing_id', 'listing_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available')
                    ->where('moderation_status', 'approved');
    }

    public function scopeWithFilters(Builder $query, array $filters): Builder
    {
        return $query
            ->when($filters['operation_type'] ?? null, fn (Builder $q, string $val) =>
                $q->where('operation_type', $val)
            )
            ->when($filters['min_price'] ?? null, fn (Builder $q, string $val) =>
                $q->where('price', '>=', $val)
            )
            ->when($filters['max_price'] ?? null, fn (Builder $q, string $val) =>
                $q->where('price', '<=', $val)
            )
            ->when($filters['property_type'] ?? null, fn (Builder $q, string $val) =>
                $q->whereHas('property', fn (Builder $p) => $p->where('property_type', $val))
            )
            ->when(
                filled($filters['neighborhood_id'] ?? null) && ($filters['neighborhood_id'] ?? null) !== 'all',
                fn (Builder $q) => $q->whereHas('property', fn (Builder $p) =>
                    $p->where('neighborhood_id', $filters['neighborhood_id'])
                )
            )
            ->when(
                filled($filters['bedrooms'] ?? null) && ($filters['bedrooms'] ?? null) !== 'all',
                fn (Builder $q) => $q->whereHas('property', fn (Builder $p) =>
                    $p->where('bedrooms', '>=', $filters['bedrooms'])
                )
            )
            ->when($filters['q'] ?? null, fn (Builder $q, string $val) =>
                $q->whereHas('property', fn (Builder $p) =>
                    $p->where('title', 'ILIKE', "%{$val}%")
                      ->orWhere('description', 'ILIKE', "%{$val}%")
                      ->orWhere('address', 'ILIKE', "%{$val}%")
                )
            );
    }

    public function scopeWithFeatures(Builder $query, array $features): Builder
    {
        $features = array_filter((array) $features);

        return $query
            ->when(in_array('garage', $features), fn (Builder $q) =>
                $q->whereHas('property', fn (Builder $p) => $p->where('has_garage', true))
            )
            ->when(in_array('pool', $features), fn (Builder $q) =>
                $q->whereHas('property', fn (Builder $p) => $p->whereJsonContains('amenities', 'piscina'))
            )
            ->when(in_array('air_conditioning', $features), fn (Builder $q) =>
                $q->whereHas('property', fn (Builder $p) => $p->whereJsonContains('amenities', 'aire_acondicionado'))
            )
            ->when(in_array('furnished', $features), fn (Builder $q) =>
                $q->whereHas('property', fn (Builder $p) => $p->whereJsonContains('amenities', 'amoblado'))
            )
            ->when(in_array('pets', $features), fn (Builder $q) =>
                $q->where('allows_pets', true)
            );
    }

    public function scopeWithSort(Builder $query, ?string $sort): Builder
    {
        return match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            default     => $query->orderBy('created_at', 'desc'),
        };
    }
}