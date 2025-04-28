<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use Illuminate\Http\Request;
use \Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    use AuthorizesRequests;
    //
    public function index()
    {
        $this->authorize('view-subscriptions');
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $subscriptions = Subscription::with([
            'user',
            'productPrice',
            'productPrice.product',
            'approvedBy',
        ])->get();


        return Inertia::render('Dashboard/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'canViewSubscriptions' => $user->can('view-subscriptions'),
        ]);
    }

    public function show(Subscription $subscription)
    {
        $this->authorize('view-subscriptions', $subscription);
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return Inertia::render('Dashboard/Subscriptions/Show', [
            'subscription' => $subscription,
            'product_price' => $subscription->productPrice,
            'product' => $subscription->productPrice->product,
            'approved_by' => $subscription->approvedBy,
            'user' => $subscription->user,
            'canApproveSubscriptions' => $user->can('approve-subscriptions'),
            'canRejectSubscriptions' => $user->can('reject-subscriptions'),

        ]);
    }

    public function apply(Request $request)
    {
        // Validate request data
        $validated = $request->validate([
            'product_price_id' => 'required|exists:product_prices,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'auto_renew' => 'boolean',
            'subscription_number' => 'nullable|string|unique:subscriptions,subscription_number',
        ]);

        try {
            // Get product price details for better next_billing_date calculation
            $productPrice = \App\Models\ProductPrice::with('product')->findOrFail($validated['product_price_id']);

            // Calculate next_billing_date based on billing cycle
            $nextBillingDate = $this->calculateNextBillingDate($validated['start_date'], $productPrice->billing_cycle);

            // Generate subscription number if not provided
            $subscriptionNumber = $validated['subscription_number'] ?? Subscription::generateSubscriptionNumber();

            // Create subscription
            Subscription::create([
                'user_id' => Auth::id(),
                'product_price_id' => $validated['product_price_id'],
                'approved_by_id' => null,
                'subscription_number' => $subscriptionNumber,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'next_billing_date' => $nextBillingDate,
                'status' => 'pending_approval',
                'auto_renew' => $validated['auto_renew'] ?? false,
                'notes' => $request->input('notes'),
            ]);


            return redirect()->back()->with('success', __('Your subscription application has been submitted and is awaiting approval.'));
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()
                ->withInput()
                ->with('error', __('There was a problem processing your subscription. Please try again.'));
        }
    }

    /**
     * Approve a subscription
     *
     * @param Request $request
     * @param Subscription $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(Request $request, Subscription $subscription)
    {
        $this->authorize('approve-subscriptions');

        // Validate request data
        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            // Make sure the subscription is in pending_approval state
            if ($subscription->status !== 'pending_approval') {
                return redirect()->back()->with('error', __('This subscription cannot be approved because it is not in pending approval status.'));
            }
            /** @var \App\Models\User $user */
            $user = $subscription->user;

            $subscription->update([
                'approved_by_id' => $user->id,
                'status' => 'approved',
                'approved_at' => now(),
                'approval_notes' => $validated['notes'] ?? null,
            ]);

            if (!$user->hasRole('customer')) {
                $user->assignRole('customer');
            }

            return redirect()->back()->with('success', __('Subscription has been approved successfully.'));
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', __('There was a problem approving this subscription. Please try again.'));
        }
    }

    /**
     * Reject a subscription
     *
     * @param Request $request
     * @param Subscription $subscription
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Request $request, Subscription $subscription)
    {
        $this->authorize('reject-subscriptions');

        // Validate request data - notes are required for rejection
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        try {
            // Make sure the subscription is in pending_approval state
            if ($subscription->status !== 'pending_approval') {
                return redirect()->back()->with('error', __('This subscription cannot be rejected because it is not in pending approval status.'));
            }

            $subscription->update([
                'approved_by_id' => Auth::id(),
                'status' => 'rejected',
                'rejected_at' => now(),
                'rejected_notes' => $validated['notes'],
            ]);

            return redirect()->back()->with('success', __('Subscription has been rejected.'));
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', __('There was a problem rejecting this subscription. Please try again.'));
        }
    }

    public function cancel(Request $request, Subscription $subscription)
    {
        // if (Auth::id() !== $subscription->user_id) {
        //     $this->authorize('cancel-subscriptions');
        // }

        // Validate request data
        $validated = $request->validate([
            'notes' => 'required|string|max:1000',
        ]);

        try {
            // Make sure the subscription is in active state
            if ($subscription->status !== 'active') {
                return redirect()->back()->with('error', __('This subscription cannot be cancelled because it is not active.'));
            }

            // Update subscription with cancellation information
            $subscription->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancellation_notes' => $validated['notes'],
            ]);

            return redirect()->back()->with('success', __('Subscription has been cancelled successfully.'));
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', __('There was a problem cancelling this subscription. Please try again.'));
        }
    }

    /**
     * Calculate the next billing date based on billing cycle
     *
     * @param string $startDate
     * @param string $billingCycle
     * @return \Carbon\Carbon
     */
    private function calculateNextBillingDate($startDate, $billingCycle)
    {
        $startDate = \Carbon\Carbon::parse($startDate);

        return match (strtolower($billingCycle)) {
            'monthly' => $startDate->copy()->addMonth(),
            'quarterly' => $startDate->copy()->addMonths(3),
            'semi-annually' => $startDate->copy()->addMonths(6),
            'annually' => $startDate->copy()->addYear(),
            'biennially' => $startDate->copy()->addYears(2),
            'triennially' => $startDate->copy()->addYears(3),
            default => $startDate->copy()->addMonth(),
        };
    }
}
