<?php

namespace Database\Seeders;

use App\Models\Wallet;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WalletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $wallets = [
            ['name' => 'Tunai', 'description' => 'Uang tunai/cash'],
            ['name' => 'Bank BCA', 'description' => 'Rekening Bank Central Asia'],
            ['name' => 'Bank Mandiri', 'description' => 'Rekening Bank Mandiri'],
            ['name' => 'Bank BNI', 'description' => 'Rekening Bank Negara Indonesia'],
            ['name' => 'Bank BRI', 'description' => 'Rekening Bank Rakyat Indonesia'],
            ['name' => 'DANA', 'description' => 'Dompet digital DANA'],
            ['name' => 'GoPay', 'description' => 'Dompet digital GoPay dari Gojek'],
            ['name' => 'OVO', 'description' => 'Dompet digital OVO'],
            ['name' => 'ShopeePay', 'description' => 'Dompet digital ShopeePay'],
            ['name' => 'LinkAja', 'description' => 'Dompet digital LinkAja'],
            ['name' => 'Jenius', 'description' => 'Rekening digital Jenius dari BTPN'],
            ['name' => 'Tabungan', 'description' => 'Tabungan pribadi'],
            ['name' => 'Investasi', 'description' => 'Dana untuk investasi'],
            ['name' => 'Kartu Kredit', 'description' => 'Kartu Kredit'],
        ];

        foreach ($wallets as $wallet) {
            Wallet::firstOrCreate(
                ['name' => $wallet['name']],
                [
                    'description' => $wallet['description'],
                ]
            );
        }
    }
}
