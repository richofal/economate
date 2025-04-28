<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class ManagerController extends Controller
{
    use AuthorizesRequests;
    //
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $this->authorize('view-managers');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $managers = User::role('manager')
            ->get();

        return Inertia::render('Dashboard/Managers/Index', [
            'managers' => $managers,
            'canViewManagers' => $user->can('view-managers'),
        ]);
    }

    public function show(User $user)
    {
        $this->authorize('view-managers');
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        $user->load([
            'approvedSubscriptions',
            'approvedSubscriptions.productPrice.product',
        ]);

        return Inertia::render('Dashboard/Managers/Show', [
            'manager' => $user,
            'canViewManagers' => $authUser->can('view-managers'),
        ]);
    }
}
