<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    use HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'city_id',
        'birth_date',
        'occupation',
        'avatar_url',
        'bio',
        'business_name',
        'tax_id',
        'license_number',
        'verification_document_url',
        'verification_status',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'birth_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class, 'city_id', 'city_id');
    }

    public function properties(): HasMany
    {
        return $this->hasMany(Property::class, 'owner_id');
    }

    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class, 'publisher_id');
    }

    public function searchPreference(): HasOne
    {
        return $this->hasOne(SearchPreference::class);
    }

    public function contactRequests(): HasMany
    {
        return $this->hasMany(ContactRequest::class, 'requester_id');
    }

    public function visitRequests(): HasMany
    {
        return $this->hasMany(VisitRequest::class, 'requester_id');
    }

    public function moderationLogs(): HasMany
    {
        return $this->hasMany(ModerationLog::class, 'admin_id');
    }
}
