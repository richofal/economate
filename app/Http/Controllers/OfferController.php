<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Subscription;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class OfferController extends Controller
{
    //
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('view-offers');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if ($user->hasRole('lead')) {
            $offers = Offer::where('user_id', $user->id)->get();
        } else {
            $offers = Offer::with([
                'productPrice.product',
                'user',
                'createdBy',
            ])->get();
        }
        return Inertia::render('Dashboard/Offers/Index', [
            'offers' => $offers,
            'canViewOffers' => $user->can('view-offers'),
        ]);
    }

    public function show(Offer $offer)
    {
        $this->authorize('view-offers');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $offer->load([
            'productPrice.product',
            'user',
            'createdBy',
        ]);


        return Inertia::render('Dashboard/Offers/Show', [
            'offer' => $offer,
            'canViewOffers' => $user->can('view-offers'),
            'canManageOffers' => $user->can('manage-offers'),
        ]);
    }


    /**
     * Sales can mark an offer as accepted
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function accept(Offer $offer)
    {
        $this->authorize('manage-offers');

        try {
            // Check if the offer belongs to the user
            if ($offer->user_id !== Auth::id()) {
                return redirect()->back()->with('error', 'This offer does not belong to the specified lead.');
            }

            if ($offer->status !== 'pending') {
                return redirect()->back()->with('error', 'Only pending offers can be marked as accepted.');
            }


            // Update offer status
            $offer->update([
                'status' => 'accepted',
                'accepted_at' => now(),
                'user_id' => Auth::id(),
            ]);

            Subscription::create([
                'user_id' => Auth::id(),
                'product_price_id' => $offer->product_price_id,
                'subscription_number' => Subscription::generateSubscriptionNumber(),
                'start_date' => now(),
                'end_date' => now()->addMonths($offer->productPrice->product->billing_cycle),
                'next_billing_date' => now()->addMonth(),
                'status' => 'pending_approval',
                'auto_renew' => false,
            ]);

            // Optionally ask if the sales wants to convert the offer to a subscription
            return redirect()->route('offers.index')
                ->with('success', "Offer #{$offer->offer_number} has been marked as accepted.")
                ->with('show_convert_modal', true)
                ->with('offer_id', $offer->id);
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', 'There was a problem updating the offer. Please try again.');
        }
    }

    /**
     * Sales can mark an offer as rejected
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Offer  $offer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Offer $offer)
    {
        $this->authorize('manage-offers');

        try {
            // Check if the offer belongs to the user
            if ($offer->user_id !== Auth::id()) {
                return redirect()->back()->with('error', 'This offer does not belong to the specified lead.');
            }

            if ($offer->status !== 'pending') {
                return redirect()->back()->with('error', 'Only pending offers can be marked as rejected.');
            }

            // Update offer status
            $offer->update([
                'status' => 'rejected',
                'used_id' => Auth::id(),
            ]);


            return redirect()->route('offers.index')
                ->with('success', "Offer #{$offer->offer_number} has been marked as rejected.");
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()->with('error', 'There was a problem updating the offer. Please try again.');
        }
    }
}
