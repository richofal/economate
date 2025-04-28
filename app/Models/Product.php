<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    //
    protected $table = 'products';

    protected $fillable = [
        'name',
        'description',
        'category_id',
        'code',
        'setup_fee',
        'bandwidth',
        'bandwidth_type',
        'connection_type',
        'minimum_contract_months',
        'is_recurring',
        'is_active',
        'uptime_guarantee',
        'is_featured'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'is_recurring' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function productPrices(): HasMany
    {
        return $this->hasMany(ProductPrice::class);
    }
}
