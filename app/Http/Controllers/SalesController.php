<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class SalesController extends Controller
{
    //
    use AuthorizesRequests;

    public function index()
    {
        $this->authorize('view-sales');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $sales = User::role('sales')
            ->get();

        return Inertia::render('Dashboard/Sales/Index', [
            'sales' => $sales,
            'canViewSales' => $user->can('view-sales'),
            'canCreateSales' => $user->can('create-sales'),
            'canEditSales' => $user->can('edit-sales'),
            'canDeleteSales' => $user->can('delete-sales'),
        ]);
    }

    public function show(User $user)
    {
        $this->authorize('view-sales');
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();

        $user->load([
            'createdOffers',
            'createdOffers.productPrice.product',
        ]);

        return Inertia::render('Dashboard/Sales/Show', [
            'sales' => $user,
            'canViewSales' => $authUser->can('view-sales'),
        ]);
    }
}
