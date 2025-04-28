<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            ProductPriceSeeder::class,
            UserSeeder::class,
            OfferSeeder::class,
            SubscriptionSeeder::class,
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@smart.com',
            'password' => bcrypt('password'),
            'address' => '123 Admin St',
            'phone' => '123-456-7890',
        ]);

        $admin->assignRole('admin');

        $manager = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@smart.com',
            'password' => bcrypt('password'),
            'address' => '456 Manager St',
            'phone' => '987-654-3210',
        ]);
        $manager->assignRole('manager');

        $sales = User::factory()->create([
            'name' => 'Sales User',
            'email' => 'sales@smart.com',
            'password' => bcrypt('password'),
            'address' => '789 Sales St',
            'phone' => '456-789-0123',
        ]);

        $sales->assignRole('sales');
    }
}
