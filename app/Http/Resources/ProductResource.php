<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'description' => $this->description,

            // Technical specifications
            'bandwidth' => $this->bandwidth,
            'bandwidth_type' => $this->bandwidth_type,
            'connection_type' => $this->connection_type,
            'uptime_guarantee' => $this->uptime_guarantee,

            // Contract terms
            'setup_fee' => $this->setup_fee,
            'minimum_contract_months' => $this->minimum_contract_months,
            'is_recurring' => $this->is_recurring,

            // Status and categorization
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'category_id' => $this->category_id,

            // Related data
            'category' => $this->when($this->relationLoaded('category'), function () {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                    'slug' => $this->category->slug,
                ];
            }),

            // Pricing information
            'prices' => $this->when($this->relationLoaded('productPrices'), function () {
                return $this->productPrices->map(function ($price) {
                    return [
                        'id' => $price->id,
                        'billing_cycle' => $price->billing_cycle,
                        'price' => $price->price,
                        'status' => $price->status,
                    ];
                });
            }),

            // Common pricing shortcuts for quick access
            'pricing' => [
                'setup_fee' => $this->setup_fee,
                'monthly' => $this->when($this->relationLoaded('productPrices'), function () {
                    return $this->productPrices->where('billing_cycle', 'monthly')->first()?->price;
                }),
                'quarterly' => $this->when($this->relationLoaded('productPrices'), function () {
                    return $this->productPrices->where('billing_cycle', 'quarterly')->first()?->price;
                }),
                'semi_annual' => $this->when($this->relationLoaded('productPrices'), function () {
                    return $this->productPrices->where('billing_cycle', 'semi_annual')->first()?->price;
                }),
                'annual' => $this->when($this->relationLoaded('productPrices'), function () {
                    return $this->productPrices->where('billing_cycle', 'annual')->first()?->price;
                }),
            ],

            // Timestamps
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at ? $this->deleted_at->format('Y-m-d H:i:s') : null,
        ];
    }
}
