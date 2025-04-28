<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ProductPrice;
use App\Models\Subscription;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all product prices
        $productPrices = ProductPrice::all();

        // Get all customers for assignments
        $customers = User::role('customer')->get();
        if ($customers->isEmpty()) {
            $this->command->info('No customers found. Creating sample customers...');
            $customers = User::factory()->count(5)->create()->each(function ($user) {
                $user->assignRole('customer');
            });
        }

        // Get all managers for approval assignments
        $managers = User::role('manager')->get();
        if ($managers->isEmpty()) {
            $this->command->info('No managers found. Creating sample managers...');
            $managers = User::factory()->count(3)->create()->each(function ($user) {
                $user->assignRole('manager');
            });
        }

        $this->command->info('Creating subscriptions for each product price...');

        foreach ($productPrices as $productPrice) {
            // Create a few subscriptions in pending_approval status
            Subscription::factory()
                ->count(2)
                ->pendingApproval()
                ->create([
                    'product_price_id' => $productPrice->id,
                    'user_id' => $customers->random()->id,
                    // No approved_by_id for pending subscriptions
                ]);

            // Create active subscriptions
            Subscription::factory()
                ->count(3)
                ->active()
                ->create([
                    'product_price_id' => $productPrice->id,
                    'user_id' => $customers->random()->id,
                    'approved_by_id' => $managers->random()->id,
                ]);

            // Create cancelled subscriptions
            Subscription::factory()
                ->count(1)
                ->cancelled()
                ->create([
                    'product_price_id' => $productPrice->id,
                    'user_id' => $customers->random()->id,
                    'approved_by_id' => $managers->random()->id,
                ]);

            // Create suspended subscriptions
            Subscription::factory()
                ->count(1)
                ->suspended()
                ->create([
                    'product_price_id' => $productPrice->id,
                    'user_id' => $customers->random()->id,
                    'approved_by_id' => $managers->random()->id,
                ]);

            // Create expired subscriptions
            Subscription::factory()
                ->count(1)
                ->expired()
                ->create([
                    'product_price_id' => $productPrice->id,
                    'user_id' => $customers->random()->id,
                    'approved_by_id' => $managers->random()->id,
                ]);
        }

        $this->command->info('Successfully created ' . Subscription::count() . ' subscriptions.');
    }
}
