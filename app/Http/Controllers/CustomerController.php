<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    //
    use AuthorizesRequests;


    public function index()
    {

        $this->authorize('view-customers');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $customers = User::role('customer')
            ->get();

        return Inertia::render('Dashboard/Customers/Index', [
            'customers' => $customers,
            'canViewCustomers' => $user->can('view-customers'),
        ]);
    }

    public function show(User $user)
    {
        $this->authorize('view-customers');
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();

        $user->load([
            'subscriptions',
            'subscriptions.productPrice.product',
            'subscriptions.approvedBy',
        ]);

        return Inertia::render('Dashboard/Customers/Show', [
            'customer' => $user,
            'canViewCustomers' => $authUser->can('view-customers'),
        ]);
    }
}
