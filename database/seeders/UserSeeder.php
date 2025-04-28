<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        User::factory()->count(10)->lead()->create()->each(function ($user) {
            $user->assignRole('lead');
        });

        User::factory()->count(10)->sales()->create()->each(function ($user) {
            $user->assignRole('sales');
        });

        User::factory()->count(10)->customer()->create()->each(function ($user) {
            $user->assignRole('customer');
        });
        User::factory()->count(5)->manager()->create()->each(function ($user) {
            $user->assignRole('manager');
        });
    }
}
