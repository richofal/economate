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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')
                ->comment('Customer who subscribed to the service');
            $table->foreignId('product_price_id')->constrained()->onDelete('cascade');
            $table->foreignId('approved_by_id')->nullable()->constrained('users')
                ->comment('Manager who approved the subscription');
            $table->string('subscription_number')->unique();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('next_billing_date')->nullable();
            $table->enum('status', [
                'pending_approval',
                'approved',
                'rejected',
                'active',
                'suspended',
                'cancelled',
                'expired'
            ])->default('pending_approval');
            $table->timestamp('approval_requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('approval_notes')->nullable();
            $table->boolean('auto_renew')->default(true);
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_notes')->nullable();
            $table->string('rejected_at')->nullable()
                ->comment('When the subscription was rejected');
            $table->text('rejected_notes')->nullable()
                ->comment('Notes for the rejection');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
