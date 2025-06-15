<?php

namespace Database\Factories;

use App\Models\UserWallet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['credit', 'debit']);
        $descriptions = [
            'credit' => [
                'Gaji bulanan',
                'Bonus pekerjaan',
                'Pendapatan sampingan',
                'Hadiah',
                'Pembayaran kembali pinjaman',
                'Dividen investasi',
                'Penjualan barang',
                'Pendapatan sewa',
                'Pencairan dana',
                'Transfer masuk'
            ],
            'debit' => [
                'Pembayaran tagihan listrik',
                'Pembayaran internet',
                'Belanja bulanan',
                'Makan di restoran',
                'Transportasi',
                'Bahan bakar',
                'Hiburan',
                'Belanja online',
                'Pembayaran cicilan',
                'Transfer keluar'
            ],
        ];
        return [
            'user_wallet_id' => UserWallet::factory(),
            'type' => $type,
            'amount' => fake()->numberBetween(10000, 1000000), // Between 10k - 1m
            'description' => fake()->randomElement($descriptions[$type]),
            'date' => fake()->dateTimeBetween('-3 months', 'now'),
        ];
    }
    /**
     * Configure the model factory to generate credit transactions.
     */
    public function credit()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'credit',
                'description' => fake()->randomElement([
                    'Gaji bulanan',
                    'Bonus pekerjaan',
                    'Pendapatan sampingan',
                    'Hadiah',
                    'Pembayaran kembali pinjaman',
                    'Dividen investasi',
                    'Penjualan barang',
                    'Pendapatan sewa',
                    'Pencairan dana',
                    'Transfer masuk'
                ]),
            ];
        });
    }

    /**
     * Configure the model factory to generate debit transactions.
     */
    public function debit()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'debit',
                'description' => fake()->randomElement([
                    'Pembayaran tagihan listrik',
                    'Pembayaran internet',
                    'Belanja bulanan',
                    'Makan di restoran',
                    'Transportasi',
                    'Bahan bakar',
                    'Hiburan',
                    'Belanja online',
                    'Pembayaran cicilan',
                    'Transfer keluar'
                ]),
            ];
        });
    }
}
