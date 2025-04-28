<?php

namespace Database\Seeders;

use App\Models\ProductPrice;
use Illuminate\Database\Seeder;

class ProductPriceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $productPrices = [
            // Home Basic Prices
            [
                'product_id' => 1,
                'billing_cycle' => 'monthly',
                'price' => 39.99,
                'status' => 'active',
            ],
            [
                'product_id' => 1,
                'billing_cycle' => 'quarterly',
                'price' => 109.99,
                'status' => 'active',
            ],
            [
                'product_id' => 1,
                'billing_cycle' => 'semi_annual',
                'price' => 209.99,
                'status' => 'active',
            ],
            [
                'product_id' => 1,
                'billing_cycle' => 'annual',
                'price' => 399.99,
                'status' => 'active',
            ],

            // Home Standard Prices
            [
                'product_id' => 2,
                'billing_cycle' => 'monthly',
                'price' => 59.99,
                'status' => 'active',
            ],
            [
                'product_id' => 2,
                'billing_cycle' => 'quarterly',
                'price' => 169.99,
                'status' => 'active',
            ],
            [
                'product_id' => 2,
                'billing_cycle' => 'semi_annual',
                'price' => 329.99,
                'status' => 'active',
            ],
            [
                'product_id' => 2,
                'billing_cycle' => 'annual',
                'price' => 599.99,
                'status' => 'active',
            ],

            // Home Premium Prices
            [
                'product_id' => 3,
                'billing_cycle' => 'monthly',
                'price' => 79.99,
                'status' => 'active',
            ],
            [
                'product_id' => 3,
                'billing_cycle' => 'quarterly',
                'price' => 229.99,
                'status' => 'active',
            ],
            [
                'product_id' => 3,
                'billing_cycle' => 'semi_annual',
                'price' => 449.99,
                'status' => 'active',
            ],
            [
                'product_id' => 3,
                'billing_cycle' => 'annual',
                'price' => 799.99,
                'status' => 'active',
            ],

            // Business Starter Prices
            [
                'product_id' => 4,
                'billing_cycle' => 'monthly',
                'price' => 99.99,
                'status' => 'active',
            ],
            [
                'product_id' => 4,
                'billing_cycle' => 'quarterly',
                'price' => 284.99,
                'status' => 'active',
            ],
            [
                'product_id' => 4,
                'billing_cycle' => 'semi_annual',
                'price' => 539.99,
                'status' => 'active',
            ],
            [
                'product_id' => 4,
                'billing_cycle' => 'annual',
                'price' => 999.99,
                'status' => 'active',
            ],

            // Business Pro Prices
            [
                'product_id' => 5,
                'billing_cycle' => 'monthly',
                'price' => 149.99,
                'status' => 'active',
            ],
            [
                'product_id' => 5,
                'billing_cycle' => 'quarterly',
                'price' => 429.99,
                'status' => 'active',
            ],
            [
                'product_id' => 5,
                'billing_cycle' => 'semi_annual',
                'price' => 809.99,
                'status' => 'active',
            ],
            [
                'product_id' => 5,
                'billing_cycle' => 'annual',
                'price' => 1499.99,
                'status' => 'active',
            ],

            // Business Elite Prices
            [
                'product_id' => 6,
                'billing_cycle' => 'monthly',
                'price' => 249.99,
                'status' => 'active',
            ],
            [
                'product_id' => 6,
                'billing_cycle' => 'quarterly',
                'price' => 699.99,
                'status' => 'active',
            ],
            [
                'product_id' => 6,
                'billing_cycle' => 'semi_annual',
                'price' => 1349.99,
                'status' => 'active',
            ],
            [
                'product_id' => 6,
                'billing_cycle' => 'annual',
                'price' => 2499.99,
                'status' => 'active',
            ],

            // Enterprise Basic Prices
            [
                'product_id' => 7,
                'billing_cycle' => 'monthly',
                'price' => 499.99,
                'status' => 'active',
            ],
            [
                'product_id' => 7,
                'billing_cycle' => 'quarterly',
                'price' => 1399.99,
                'status' => 'active',
            ],
            [
                'product_id' => 7,
                'billing_cycle' => 'semi_annual',
                'price' => 2699.99,
                'status' => 'active',
            ],
            [
                'product_id' => 7,
                'billing_cycle' => 'annual',
                'price' => 4999.99,
                'status' => 'active',
            ],

            // Enterprise Plus Prices
            [
                'product_id' => 8,
                'billing_cycle' => 'monthly',
                'price' => 999.99,
                'status' => 'active',
            ],
            [
                'product_id' => 8,
                'billing_cycle' => 'quarterly',
                'price' => 2849.99,
                'status' => 'active',
            ],
            [
                'product_id' => 8,
                'billing_cycle' => 'semi_annual',
                'price' => 5399.99,
                'status' => 'active',
            ],
            [
                'product_id' => 8,
                'billing_cycle' => 'annual',
                'price' => 9999.99,
                'status' => 'active',
            ],

            // Enterprise Ultimate Prices
            [
                'product_id' => 9,
                'billing_cycle' => 'monthly',
                'price' => 1999.99,
                'status' => 'active',
            ],
            [
                'product_id' => 9,
                'billing_cycle' => 'quarterly',
                'price' => 5699.99,
                'status' => 'active',
            ],
            [
                'product_id' => 9,
                'billing_cycle' => 'semi_annual',
                'price' => 10799.99,
                'status' => 'active',
            ],
            [
                'product_id' => 9,
                'billing_cycle' => 'annual',
                'price' => 19999.99,
                'status' => 'active',
            ],

            // Fiber 100 Prices
            [
                'product_id' => 10,
                'billing_cycle' => 'monthly',
                'price' => 79.99,
                'status' => 'active',
            ],
            [
                'product_id' => 10,
                'billing_cycle' => 'quarterly',
                'price' => 229.99,
                'status' => 'active',
            ],
            [
                'product_id' => 10,
                'billing_cycle' => 'semi_annual',
                'price' => 429.99,
                'status' => 'active',
            ],
            [
                'product_id' => 10,
                'billing_cycle' => 'annual',
                'price' => 799.99,
                'status' => 'active',
            ],

            // Fiber 500 Prices
            [
                'product_id' => 11,
                'billing_cycle' => 'monthly',
                'price' => 129.99,
                'status' => 'active',
            ],
            [
                'product_id' => 11,
                'billing_cycle' => 'quarterly',
                'price' => 369.99,
                'status' => 'active',
            ],
            [
                'product_id' => 11,
                'billing_cycle' => 'semi_annual',
                'price' => 699.99,
                'status' => 'active',
            ],
            [
                'product_id' => 11,
                'billing_cycle' => 'annual',
                'price' => 1299.99,
                'status' => 'active',
            ],

            // Fiber Gigabit Prices
            [
                'product_id' => 12,
                'billing_cycle' => 'monthly',
                'price' => 199.99,
                'status' => 'active',
            ],
            [
                'product_id' => 12,
                'billing_cycle' => 'quarterly',
                'price' => 569.99,
                'status' => 'active',
            ],
            [
                'product_id' => 12,
                'billing_cycle' => 'semi_annual',
                'price' => 1079.99,
                'status' => 'active',
            ],
            [
                'product_id' => 12,
                'billing_cycle' => 'annual',
                'price' => 1999.99,
                'status' => 'active',
            ],

            // Wireless Basic Prices
            [
                'product_id' => 13,
                'billing_cycle' => 'monthly',
                'price' => 49.99,
                'status' => 'active',
            ],
            [
                'product_id' => 13,
                'billing_cycle' => 'quarterly',
                'price' => 139.99,
                'status' => 'active',
            ],
            [
                'product_id' => 13,
                'billing_cycle' => 'semi_annual',
                'price' => 269.99,
                'status' => 'active',
            ],
            [
                'product_id' => 13,
                'billing_cycle' => 'annual',
                'price' => 499.99,
                'status' => 'active',
            ],

            // Wireless Plus Prices
            [
                'product_id' => 14,
                'billing_cycle' => 'monthly',
                'price' => 69.99,
                'status' => 'active',
            ],
            [
                'product_id' => 14,
                'billing_cycle' => 'quarterly',
                'price' => 199.99,
                'status' => 'active',
            ],
            [
                'product_id' => 14,
                'billing_cycle' => 'semi_annual',
                'price' => 379.99,
                'status' => 'active',
            ],
            [
                'product_id' => 14,
                'billing_cycle' => 'annual',
                'price' => 699.99,
                'status' => 'active',
            ],

            // Wireless Pro Prices
            [
                'product_id' => 15,
                'billing_cycle' => 'monthly',
                'price' => 119.99,
                'status' => 'active',
            ],
            [
                'product_id' => 15,
                'billing_cycle' => 'quarterly',
                'price' => 339.99,
                'status' => 'active',
            ],
            [
                'product_id' => 15,
                'billing_cycle' => 'semi_annual',
                'price' => 649.99,
                'status' => 'active',
            ],
            [
                'product_id' => 15,
                'billing_cycle' => 'annual',
                'price' => 1199.99,
                'status' => 'active',
            ],

            // Dedicated 50 Prices
            [
                'product_id' => 16,
                'billing_cycle' => 'monthly',
                'price' => 599.99,
                'status' => 'active',
            ],
            [
                'product_id' => 16,
                'billing_cycle' => 'quarterly',
                'price' => 1699.99,
                'status' => 'active',
            ],
            [
                'product_id' => 16,
                'billing_cycle' => 'semi_annual',
                'price' => 3239.99,
                'status' => 'active',
            ],
            [
                'product_id' => 16,
                'billing_cycle' => 'annual',
                'price' => 5999.99,
                'status' => 'active',
            ],

            // Dedicated 100 Prices
            [
                'product_id' => 17,
                'billing_cycle' => 'monthly',
                'price' => 999.99,
                'status' => 'active',
            ],
            [
                'product_id' => 17,
                'billing_cycle' => 'quarterly',
                'price' => 2849.99,
                'status' => 'active',
            ],
            [
                'product_id' => 17,
                'billing_cycle' => 'semi_annual',
                'price' => 5399.99,
                'status' => 'active',
            ],
            [
                'product_id' => 17,
                'billing_cycle' => 'annual',
                'price' => 9999.99,
                'status' => 'active',
            ],

            // Dedicated 500 Prices
            [
                'product_id' => 18,
                'billing_cycle' => 'monthly',
                'price' => 2499.99,
                'status' => 'active',
            ],
            [
                'product_id' => 18,
                'billing_cycle' => 'quarterly',
                'price' => 7124.99,
                'status' => 'active',
            ],
            [
                'product_id' => 18,
                'billing_cycle' => 'semi_annual',
                'price' => 13499.99,
                'status' => 'active',
            ],
            [
                'product_id' => 18,
                'billing_cycle' => 'annual',
                'price' => 24999.99,
                'status' => 'active',
            ],

            // Internet + Voice Basic Prices
            [
                'product_id' => 19,
                'billing_cycle' => 'monthly',
                'price' => 89.99,
                'status' => 'active',
            ],
            [
                'product_id' => 19,
                'billing_cycle' => 'quarterly',
                'price' => 254.99,
                'status' => 'active',
            ],
            [
                'product_id' => 19,
                'billing_cycle' => 'semi_annual',
                'price' => 484.99,
                'status' => 'active',
            ],
            [
                'product_id' => 19,
                'billing_cycle' => 'annual',
                'price' => 899.99,
                'status' => 'active',
            ],

            // Internet + Security Standard Prices
            [
                'product_id' => 20,
                'billing_cycle' => 'monthly',
                'price' => 99.99,
                'status' => 'active',
            ],
            [
                'product_id' => 20,
                'billing_cycle' => 'quarterly',
                'price' => 284.99,
                'status' => 'active',
            ],
            [
                'product_id' => 20,
                'billing_cycle' => 'semi_annual',
                'price' => 539.99,
                'status' => 'active',
            ],
            [
                'product_id' => 20,
                'billing_cycle' => 'annual',
                'price' => 999.99,
                'status' => 'active',
            ],

            // Complete Office Bundle Prices
            [
                'product_id' => 21,
                'billing_cycle' => 'monthly',
                'price' => 199.99,
                'status' => 'active',
            ],
            [
                'product_id' => 21,
                'billing_cycle' => 'quarterly',
                'price' => 569.99,
                'status' => 'active',
            ],
            [
                'product_id' => 21,
                'billing_cycle' => 'semi_annual',
                'price' => 1079.99,
                'status' => 'active',
            ],
            [
                'product_id' => 21,
                'billing_cycle' => 'annual',
                'price' => 1999.99,
                'status' => 'active',
            ],

            // New Customer Special Prices
            [
                'product_id' => 22,
                'billing_cycle' => 'monthly',
                'price' => 39.99,
                'status' => 'active',
            ],
            [
                'product_id' => 22,
                'billing_cycle' => 'quarterly',
                'price' => 109.99,
                'status' => 'active',
            ],
            [
                'product_id' => 22,
                'billing_cycle' => 'semi_annual',
                'price' => 209.99,
                'status' => 'active',
            ],
            [
                'product_id' => 22,
                'billing_cycle' => 'annual',
                'price' => 399.99,
                'status' => 'active',
            ],

            // Summer Fiber Promotion Prices
            [
                'product_id' => 23,
                'billing_cycle' => 'monthly',
                'price' => 69.99,
                'status' => 'active',
            ],
            [
                'product_id' => 23,
                'billing_cycle' => 'quarterly',
                'price' => 199.99,
                'status' => 'active',
            ],
            [
                'product_id' => 23,
                'billing_cycle' => 'semi_annual',
                'price' => 379.99,
                'status' => 'active',
            ],
            [
                'product_id' => 23,
                'billing_cycle' => 'annual',
                'price' => 699.99,
                'status' => 'active',
            ],

            // Business Upgrade Special Prices
            [
                'product_id' => 24,
                'billing_cycle' => 'monthly',
                'price' => 149.99,
                'status' => 'active',
            ],
            [
                'product_id' => 24,
                'billing_cycle' => 'quarterly',
                'price' => 429.99,
                'status' => 'active',
            ],
            [
                'product_id' => 24,
                'billing_cycle' => 'semi_annual',
                'price' => 809.99,
                'status' => 'active',
            ],
            [
                'product_id' => 24,
                'billing_cycle' => 'annual',
                'price' => 1499.99,
                'status' => 'active',
            ],
        ];

        foreach ($productPrices as $productPrice) {
            ProductPrice::create($productPrice);
        }

        $this->command->info('Product prices seeded successfully!');
    }
}
