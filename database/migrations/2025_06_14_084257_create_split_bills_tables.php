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
        Schema::create('split_bills', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('total_amount', 15, 2)->default(0.00); // Total amount of the split bill
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa yang membuat
            $table->timestamps();
        });

        Schema::create('split_bill_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('split_bill_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->unsignedInteger('quantity')->default(1);
            $table->timestamps();
        });

        Schema::create('split_bill_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('split_bill_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->decimal('amount_owed', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('split_bill_participants');
        Schema::dropIfExists('split_bill_items');
        Schema::dropIfExists('split_bills');
    }
};
