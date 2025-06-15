<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Wallet;
use App\Models\UserWallet;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserWalletTransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Creating 10 users with wallets and transactions...');
        $userCount = User::where('email', '!=', 'admin@example.com')->count();

        // Create 10 users if needed
        if ($userCount < 10) {
            User::factory(10 - $userCount)->create()->each(function ($user) {
                if (class_exists('\Spatie\Permission\Models\Role')) {
                    $user->assignRole('user');
                }

                $this->createWalletsForUser($user);
            });
        } else {
            // Use existing users
            User::where('email', '!=', 'admin@example.com')
                ->take(10)
                ->get()
                ->each(function ($user) {
                    $this->createWalletsForUser($user);
                });
        }

        $this->command->info('Database seeding completed successfully!');
    }

    /**
     * Create wallets and transactions for a user
     */
    private function createWalletsForUser(User $user): void
    {
        // Get all available wallets
        $wallets = Wallet::all();

        // Ensure we have enough wallets
        if ($wallets->count() < 3) {
            $neededWallets = 3 - $wallets->count();
            Wallet::factory($neededWallets)->create();
            $wallets = Wallet::all();
        }

        // Take 3 random wallets
        $selectedWallets = $wallets->random(3);

        // Create user wallets
        foreach ($selectedWallets as $wallet) {
            // Check if user already has this wallet
            $userWallet = UserWallet::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'wallet_id' => $wallet->id
                ],
                [
                    'balance' => 0,
                ]
            );

            $this->createTransactionsForWallet($userWallet);
        }
    }

    /**
     * Create transactions for a user wallet
     */
    private function createTransactionsForWallet(UserWallet $userWallet): void
    {
        // Check if wallet already has transactions
        $transactionCount = Transaction::where('user_wallet_id', $userWallet->id)->count();

        if ($transactionCount < 10) {
            // Create transactions to reach at least 10
            $neededTransactions = 10 - $transactionCount;

            // Create transactions with random dates in the last 3 months
            $transactions = [];
            $balance = 0;

            // Generate random transactions
            for ($i = 0; $i < $neededTransactions; $i++) {
                $type = fake()->randomElement(['credit', 'debit']);
                $amount = fake()->numberBetween(10000, 1000000);

                // Descriptions based on transaction type
                $creditDescriptions = [
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
                ];

                $debitDescriptions = [
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
                ];

                $description = $type === 'credit'
                    ? fake()->randomElement($creditDescriptions)
                    : fake()->randomElement($debitDescriptions);

                $date = fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d H:i:s');

                // Update running balance
                if ($type === 'credit') {
                    $balance += $amount;
                } else {
                    $balance -= $amount;
                }

                $transactions[] = [
                    'user_wallet_id' => $userWallet->id,
                    'type' => $type,
                    'amount' => $amount,
                    'description' => $description,
                    'date' => $date,
                    'created_at' => $date,
                    'updated_at' => $date,
                ];
            }

            // Insert all transactions at once
            DB::table('transactions')->insert($transactions);

            // Update the wallet balance
            $userWallet->balance = $balance >= 0 ? $balance : 0; // Prevent negative balance
            $userWallet->save();
        }
    }
}
