<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OfferResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'offer_number' => $this->offer_number,
            'status' => $this->status,
            'contract_length_months' => $this->contract_length_months,
            'auto_renew' => $this->auto_renew,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
            'deleted_at' => $this->deleted_at?->format('Y-m-d H:i:s'),

            // Calculated fields
            'is_active' => !$this->deleted_at && in_array($this->status, ['pending', 'accepted']),
            'can_be_accepted' => $this->status === 'pending',
            'can_be_rejected' => $this->status === 'pending',
            'can_be_expired' => in_array($this->status, ['pending', 'accepted']),
            'can_be_converted' => $this->status === 'accepted',
        ];

        // Add product price if the relationship is loaded
        if ($this->relationLoaded('productPrice')) {
            $productPrice = $this->productPrice;
            $data['productPrice'] = [
                'id' => $productPrice->id,
                'billing_cycle' => $productPrice->billing_cycle,
                'price' => $productPrice->price,
                'term_months' => $productPrice->term_months,
                'setup_fee' => $productPrice->setup_fee,
            ];

            // Add product if the relationship is loaded on product price
            if ($productPrice->relationLoaded('product')) {
                $product = $productPrice->product;
                $data['productPrice']['product'] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'code' => $product->code,
                    'description' => $product->description,
                    'is_active' => $product->is_active,
                ];

                // Add category if the relationship is loaded on product
                if ($product->relationLoaded('category')) {
                    $data['product_price']['product']['category'] = [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ];
                }
            }
        }

        // Add user (lead) if the relationship is loaded
        if ($this->relationLoaded('user')) {
            $data['user'] = [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
                'phone' => $this->user->phone,
                'address' => $this->user->address,
            ];
        }

        // Add created by (sales person) if the relationship is loaded
        if ($this->relationLoaded('createdBy')) {
            $data['createdBy'] = [
                'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
                'email' => $this->createdBy->email,
                'phone' => $this->createdBy->phone,
            ];
        }

        // Add calculated pricing information
        if ($this->relationLoaded('productPrice')) {
            $price = $this->productPrice->price;
            $setupFee = $this->productPrice->setup_fee ?? 0;

            $data['pricing'] = [
                'base_price' => $price,
                'setup_fee' => $setupFee,
            ];

            // If contract length is set, calculate total contract value
            if ($this->contract_length_months) {
                $monthlyPrice = $this->productPrice->billing_cycle === 'monthly'
                    ? $price
                    : ($this->productPrice->billing_cycle === 'annual' ? $price / 12 : $price);

                $data['pricing']['monthly_price'] = round($monthlyPrice, 2);
                $data['pricing']['total_contract_value'] = round(
                    ($monthlyPrice *   $this->contract_length_months) + $setupFee,
                    2
                );
            }
        }

        return $data;
    }
}
