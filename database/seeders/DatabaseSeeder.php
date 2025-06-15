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
        ]);

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@admin.com',
            'password' => bcrypt('password'),
            'address' => '123 Admin St',
            'phone' => '123-456-7890',
        ]);

        $admin->assignRole('admin');

        $user = User::factory()->create([
            'name' => 'Regular User',
            'email' => 'user@user.com',
            'password' => bcrypt('password'),
            'address' => '456 User Ave',
            'phone' => '987-654-3210',
        ]);
        $user->assignRole('user');

        $this->call([
            WalletSeeder::class,
            UserWalletTransactionSeeder::class,
        ]);
    }
}
