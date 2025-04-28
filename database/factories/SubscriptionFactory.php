<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generate a random status with weighted probabilities
        $status = $this->faker->randomElement([
            'active',
            'active',
            'active',      // 30% chance of active
            'pending_approval',
            'pending_approval', // 20% chance of pending approval
            'approved',                        // 10% chance of approved
            'suspended',                       // 10% chance of suspended
            'cancelled',                       // 10% chance of cancelled
            'expired',                         // 10% chance of expired
        ]);

        // Create base dates
        $createdAt = $this->faker->dateTimeBetween('-1 year', 'now');
        $startDate = Carbon::parse($createdAt)->addDays(rand(1, 7));

        // Determine contract length (3, 6, 12, or 24 months)
        $contractLength = $this->faker->randomElement([3, 6, 12, 24]);
        $endDate = Carbon::parse($startDate)->addMonths($contractLength);

        // Set auto-renew (more likely to be true than false)
        $autoRenew = $this->faker->boolean(70);

        // Calculate next billing date based on start date and billing cycle
        $nextBillingDate = null;
        if (in_array($status, ['active', 'approved'])) {
            $now = Carbon::now();
            $billingStart = Carbon::parse($startDate);

            // Calculate billing interval in months (assuming monthly by default)
            $billingMonths = 1;

            // Find the next billing date after now
            while ($billingStart <= $now) {
                $billingStart->addMonths($billingMonths);
            }

            $nextBillingDate = $billingStart;
        }

        // Approval-related fields based on status
        $approvalRequestedAt = null;
        $approvedAt = null;
        $approvalNotes = null;

        if ($status === 'pending_approval') {
            $approvalRequestedAt = Carbon::parse($createdAt)->addDays(rand(1, 3));
        } elseif (in_array($status, ['approved', 'active', 'suspended', 'cancelled', 'expired'])) {
            $approvalRequestedAt = Carbon::parse($createdAt)->addDays(rand(1, 3));
            $approvedAt = Carbon::parse($approvalRequestedAt)->addDays(rand(1, 2));

            // Sometimes add approval notes
            if ($this->faker->boolean(30)) {
                $approvalNotes = $this->faker->randomElement([
                    'Approved after customer verification',
                    'Special pricing approved',
                    'Approved with standard terms',
                    'Expedited approval for VIP customer',
                    'Approved with discount applied'
                ]);
            }
        }

        // Cancellation details if cancelled
        $cancelledAt = null;
        $cancelledById = null;
        $cancellationReason = null;

        if ($status === 'cancelled') {
            $cancelledAt = Carbon::parse($startDate)->addDays(rand(15, $contractLength * 30 - 15));
            $cancellationReason = $this->faker->randomElement([
                'Customer requested cancellation',
                'Payment failed multiple times',
                'Customer switched to a different plan',
                'Service no longer needed',
                'Dissatisfied with service',
                'Business closed',
                'Moved to a different provider'
            ]);
        }

        return [
            // Relationship fields will be filled in the seeder
            // 'user_id' => (omitted),
            // 'product_price_id' => (omitted),
            // 'approved_by_id' => (omitted),

            'subscription_number' => 'SUB-' . strtoupper($this->faker->unique()->regexify('[A-Z0-9]{8}')),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'next_billing_date' => $nextBillingDate,
            'status' => $status,
            'approval_requested_at' => $approvalRequestedAt,
            'approved_at' => $approvedAt,
            'approval_notes' => $approvalNotes,
            'auto_renew' => $autoRenew,
            'cancelled_at' => $cancelledAt,
            // 'cancelled_by_id' => (omitted), // This will be set in the seeder
            'cancellation_notes' => $cancellationReason,
            'created_at' => $createdAt,
            'updated_at' => $this->faker->dateTimeBetween($createdAt, 'now'),
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure()
    {
        return $this->afterMaking(function ($subscription) {
            // Additional setup after making but before saving
        })->afterCreating(function ($subscription) {
            // Additional setup after the subscription has been created
        });
    }

    /**
     * Indicate the subscription is active.
     */
    public function active()
    {
        return $this->state(function () {
            return [
                'status' => 'active',
                'approval_requested_at' => now()->subDays(rand(5, 30)),
                'approved_at' => now()->subDays(rand(3, 28)),
                // 'approved_by_id' will be set in the seeder
            ];
        });
    }

    /**
     * Indicate the subscription is pending approval.
     */
    public function pendingApproval()
    {
        return $this->state(function () {
            return [
                'status' => 'pending_approval',
                'approval_requested_at' => now()->subDays(rand(1, 5)),
                'approved_at' => null,
            ];
        });
    }

    /**
     * Indicate the subscription is approved but not yet active.
     */
    public function approved()
    {
        return $this->state(function () {
            $requestedDate = now()->subDays(rand(5, 15));
            return [
                'status' => 'approved',
                'approval_requested_at' => $requestedDate,
                'approved_at' => $requestedDate->copy()->addDays(rand(1, 3)),
                'start_date' => now()->addDays(rand(1, 14)), // Future start date
            ];
        });
    }

    /**
     * Indicate the subscription is cancelled.
     */
    public function cancelled()
    {
        return $this->state(function () {
            $createdDate = now()->subDays(rand(60, 180));
            $startDate = Carbon::parse($createdDate)->addDays(rand(1, 7));
            $cancelledDate = Carbon::parse($startDate)->addDays(rand(30, 90));

            return [
                'status' => 'cancelled',
                'created_at' => $createdDate,
                'start_date' => $startDate,
                'approval_requested_at' => Carbon::parse($createdDate)->addDays(1),
                'approved_at' => Carbon::parse($createdDate)->addDays(2),
                'cancelled_at' => $cancelledDate,
                // 'cancelled_by_id' will be set in the seeder
                'cancellation_notes' => $this->faker->sentence(),
                'next_billing_date' => null,
            ];
        });
    }

    /**
     * Indicate the subscription is suspended.
     */
    public function suspended()
    {
        return $this->state(function () {
            $createdDate = now()->subDays(rand(30, 120));
            $startDate = Carbon::parse($createdDate)->addDays(rand(1, 7));

            return [
                'status' => 'suspended',
                'created_at' => $createdDate,
                'start_date' => $startDate,
                'approval_requested_at' => Carbon::parse($createdDate)->addDays(1),
                'approved_at' => Carbon::parse($createdDate)->addDays(2),
                'next_billing_date' => null,
                'approval_notes' => $this->faker->randomElement([
                    'Suspended due to payment issues',
                    'Temporarily suspended at customer request',
                    'Service suspended - billing issue',
                    'Suspended pending account review',
                ]),
            ];
        });
    }

    /**
     * Indicate the subscription is expired.
     */
    public function expired()
    {
        return $this->state(function () {
            $createdDate = now()->subMonths(rand(13, 25));
            $startDate = Carbon::parse($createdDate)->addDays(rand(1, 7));
            $endDate = Carbon::parse($startDate)->addMonths(12); // Most common contract length

            return [
                'status' => 'expired',
                'created_at' => $createdDate,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'approval_requested_at' => Carbon::parse($createdDate)->addDays(1),
                'approved_at' => Carbon::parse($createdDate)->addDays(2),
                'next_billing_date' => null,
                'auto_renew' => false,
            ];
        });
    }
}
