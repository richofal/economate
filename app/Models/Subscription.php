<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subscription extends Model
{
    use SoftDeletes, HasFactory;
    //

    protected $table = 'subscriptions';

    protected $fillable = [
        'user_id',
        'product_price_id',
        'approved_by_id',
        'subscription_number',
        'start_date',
        'end_date',
        'next_billing_date',
        'status',
        'approval_requested_at',
        'approved_at',
        'approval_notes',
        'auto_renew',
        'rejected_at',
        'rejection_notes',
        'cancelled_at',
        'cancelled_by_id',
        'cancellation_notes'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'start_date' => 'date',
        'end_date' => 'date',
        'next_billing_date' => 'date',
        'approval_requested_at' => 'datetime',
        'approved_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'rejected_at' => 'datetime',
        'auto_renew' => 'boolean'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }


    public function productPrice(): BelongsTo
    {
        return $this->belongsTo(ProductPrice::class);
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_id');
    }

    public static function generateSubscriptionNumber(): string
    {
        return 'SUB-' . strtoupper(uniqid());
    }
}
