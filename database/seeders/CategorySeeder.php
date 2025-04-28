<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Residential',
                'slug' => 'residential',
                'description' => 'Internet services designed for home use with varying speeds and affordability.',
            ],
            [
                'name' => 'Small Business',
                'slug' => 'small-business',
                'description' => 'Reliable internet solutions for small businesses with enhanced uptime guarantees.',
            ],
            [
                'name' => 'Enterprise',
                'slug' => 'enterprise',
                'description' => 'High-performance dedicated connections for large businesses with premium SLAs.',
            ],
            [
                'name' => 'Fiber Optic',
                'slug' => 'fiber-optic',
                'description' => 'Ultra-fast fiber optic internet connections with symmetrical upload/download speeds.',
            ],
            [
                'name' => 'Wireless',
                'slug' => 'wireless',
                'description' => 'Flexible wireless internet solutions ideal for areas without wired infrastructure.',
            ],
            [
                'name' => 'Dedicated Line',
                'slug' => 'dedicated-line',
                'description' => 'Premium dedicated connections with guaranteed bandwidth and no sharing.',
            ],
            [
                'name' => 'Bundled Services',
                'slug' => 'bundled-services',
                'description' => 'Internet packages bundled with additional services like VoIP or security.',
            ],
            [
                'name' => 'Special Promotions',
                'slug' => 'special-promotions',
                'description' => 'Limited-time promotional offers and discounted packages.',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        $this->command->info('Product categories seeded successfully!');
    }
}
