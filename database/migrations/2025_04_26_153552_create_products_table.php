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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->string('code', 50)->unique();
            $table->text('description')->nullable();
            $table->decimal('setup_fee', 10, 2)->default(0);
            $table->integer('bandwidth')->comment('In Mbps');
            $table->enum('bandwidth_type', ['mbps', 'gbps', 'tb'])->default('mbps')->comment('shared or dedicated');
            $table->enum('connection_type', ['fiber', 'wireless', 'copper', 'satellite'])->comment('Fiber, Wireless, etc.');
            $table->integer('minimum_contract_months')->default(12);
            $table->boolean('is_recurring')->default(true);
            $table->boolean('is_active')->default(true);
            $table->decimal('uptime_guarantee', 5, 2)->nullable()->comment('Percentage of guaranteed uptime');
            $table->boolean('is_featured')->default(false);
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
