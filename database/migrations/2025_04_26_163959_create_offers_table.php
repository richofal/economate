<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')
                ->comment('Customer or lead receiving the offer');
            $table->foreignId('product_price_id')->constrained()->onDelete('cascade')
                ->comment('The product price offered');
            $table->foreignId('created_by_id')->constrained('users')->onDelete('cascade')
                ->comment('Sales person who created the offer');
            $table->string('offer_number')->unique();
            $table->enum('status', [
                'pending',
                'accepted',
                'rejected',
                'expired',
                'converted'
            ])->default('pending');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
