<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\LeadCollection;
use App\Http\Resources\LeadResource;
use App\Models\Subscription;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of leads.
     *
     * @return \Inertia\Response
     */
    public function index()
    {

        $this->authorize('view-leads');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $leads = User::role('lead')
            ->get();


        return Inertia::render('Dashboard/Leads/Index', [
            'leads' => $leads,
            'canViewLeads' => $user->can('view-leads'),
        ]);
    }

    /**
     * Display the specified lead.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function show(User $user)
    {
        $this->authorize('view-leads');
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();

        $offers = $user->offers()->with(['productPrice.product', 'createdBy'])->get();

        return Inertia::render('Dashboard/Leads/Show', [
            'lead' => $user,
            'offers' => $offers,
            'canCreateOffers' => $authUser->can('create-offers'),
        ]);
    }

    /**
     * Show the form for creating a new offer for the specified lead.
     *
     * @param  \App\Models\User  $user
     * @return \Inertia\Response
     */
    public function offers(User $user)
    {
        $this->authorize('create-offers');
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();

        // Get all products that can be offered
        $products = \App\Models\Product::with(['category', 'productPrices' => function ($query) {
            $query->orderBy('price', 'asc');
        }])
            ->where('is_active', true)
            ->orderBy('name')
            ->get();


        return Inertia::render('Dashboard/Leads/Offer', [
            'lead' => $user,
            'products' => $products,
            'canCreateOffers' => $authUser->can('create-offers'),
        ]);
    }

    /**
     * Store a new offer for the lead
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\User  $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeOffers(Request $request, User $user)
    {
        $this->authorize('create-offers');

        // Validate the request
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_price_id' => 'required|exists:product_prices,id',
        ]);

        try {
            // Check if the product price belongs to the selected product
            $productPrice = \App\Models\ProductPrice::find($validated['product_price_id']);
            if ($productPrice->product_id != $validated['product_id']) {
                return redirect()->back()
                    ->withInput()
                    ->with('error', 'The selected price does not belong to the selected product.');
            }

            // Generate a unique offer number
            $offerNumber = 'OFR-' . strtoupper(substr(uniqid(), -6));

            // Create the offer
            \App\Models\Offer::create([
                'user_id' => $user->id,
                'product_price_id' => $validated['product_price_id'],
                'created_by_id' => Auth::id(),
                'offer_number' => $offerNumber,
                'status' => 'pending',
            ]);


            return redirect()->route('leads.show', $user->id)
                ->with('success', "Offer #{$offerNumber} has been created successfully and is pending customer approval.");
        } catch (\Exception $e) {
            report($e);
            return redirect()->back()
                ->withInput()
                ->with('error', 'There was a problem creating the offer. Please try again.');
        }
    }
}
