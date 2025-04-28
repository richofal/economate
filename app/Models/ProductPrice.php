<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductPrice extends Model
{
    //

    protected $table = 'product_prices';

    protected $fillable = [
        'product_id',
        'price',
        'billing_cycle',
        'term_months',
        'status',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }
}
