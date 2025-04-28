<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'address',
        'phone',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
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
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get all subscriptions where this user is the customer
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'user_id');
    }

    /**
     * Get all subscriptions approved by this user (manager role)
     */
    public function approvedSubscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'approved_by_id');
    }

    /**
     * Get all subscriptions created by this user (sales role)
     */
    public function createdSubscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'created_by_id');
    }

    /**
     * Get all subscriptions cancelled by this user
     */
    public function cancelledSubscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class, 'cancelled_by_id');
    }

    public function offers(): HasMany
    {
        return $this->hasMany(Offer::class, 'user_id');
    }

    public function createdOffers(): HasMany
    {
        return $this->hasMany(Offer::class, 'created_by_id');
    }

    /**
     * Check if user is a customer
     */
    public function isCustomer(): bool
    {
        return $this->hasRole('customer');
    }

    /**
     * Check if user is a lead
     */
    public function isLead(): bool
    {
        return $this->hasRole('lead');
    }

    /**
     * Check if user is sales
     */
    public function isSales(): bool
    {
        return $this->hasRole('sales');
    }

    /**
     * Check if user is manager
     */
    public function isManager(): bool
    {
        return $this->hasRole('manager');
    }

    /**
     * Get active subscriptions for this user
     */
    public function activeSubscriptions()
    {
        return $this->subscriptions()->where('status', 'active');
    }

    /**
     * Check if user has any active subscriptions
     */
    public function hasActiveSubscriptions(): bool
    {
        return $this->activeSubscriptions()->exists();
    }

    /**
     * Convert lead to customer
     */
    public function convertToCustomer(): self
    {
        if ($this->isLead()) {
            $this->removeRole('lead');
            $this->assignRole('customer');
        }

        return $this;
    }
}
