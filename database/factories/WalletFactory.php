<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Wallet>
 */
class WalletFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $walletTypes = [
            'Tunai',
            'Bank BCA',
            'Bank Mandiri',
            'Bank BNI',
            'Bank BRI',
            'DANA',
            'GoPay',
            'OVO',
            'ShopeePay',
            'LinkAja',
            'Jenius',
            'CIMB Niaga',
            'Tabungan',
            'Investasi'
        ];

        return [
            'name' => fake()->randomElement($walletTypes),
            'description' => fake()->sentence(),
        ];
    }
}
