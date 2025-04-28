<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Offer;
use App\Models\ProductPrice;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OfferSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all leads
        $leads = User::role('lead')->get();

        // Get all sales reps
        $salesReps = User::role('sales')->get();

        // Get all product prices
        $productPrices = ProductPrice::with('product')->get();

        // Counter for offer numbers
        $offerCounter = 1;

        // For each lead, create 2 offers (one pending, one rejected)
        foreach ($leads as $lead) {
            // Choose a random sales rep for each offer
            $salesRep1 = $salesReps->random();
            $salesRep2 = $salesReps->random();

            // Choose random product prices for each offer
            $productPrice1 = $productPrices->random();
            $productPrice2 = $productPrices->random();

            // Create a pending offer
            Offer::create([
                'user_id' => $lead->id,
                'product_price_id' => $productPrice1->id,
                'created_by_id' => $salesRep1->id,
                'offer_number' => 'OF-' . str_pad($offerCounter++, 5, '0', STR_PAD_LEFT),
                'status' => 'pending',
                'created_at' => now()->subDays(rand(1, 10)),
                'updated_at' => now()->subDays(rand(0, 1)),
            ]);

            // Create a rejected offer
            Offer::create([
                'user_id' => $lead->id,
                'product_price_id' => $productPrice2->id,
                'created_by_id' => $salesRep2->id,
                'offer_number' => 'OF-' . str_pad($offerCounter++, 5, '0', STR_PAD_LEFT),
                'status' => 'rejected',
                'created_at' => now()->subDays(rand(20, 30)),
                'updated_at' => now()->subDays(rand(15, 19)),
            ]);
        }

        // Make sure each sales rep has at least 2 offers (if needed)
        foreach ($salesReps as $salesRep) {
            $offerCount = Offer::where('created_by_id', $salesRep->id)->count();

            // If the sales rep doesn't have at least 2 offers, create additional ones
            if ($offerCount < 2) {
                $additionalOffers = 2 - $offerCount;

                for ($i = 0; $i < $additionalOffers; $i++) {
                    // Choose a random lead
                    $lead = $leads->random();

                    // Choose a random product price
                    $productPrice = $productPrices->random();

                    // Create an offer with alternating status
                    Offer::create([
                        'user_id' => $lead->id,
                        'product_price_id' => $productPrice->id,
                        'created_by_id' => $salesRep->id,
                        'offer_number' => 'OF-' . str_pad($offerCounter++, 5, '0', STR_PAD_LEFT),
                        'status' => $i % 2 === 0 ? 'pending' : 'rejected',
                        'created_at' => now()->subDays(rand(1, 30)),
                        'updated_at' => now()->subDays(rand(0, 15)),
                    ]);
                }
            }
        }
    }
}
