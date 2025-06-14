<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreWalletRequest;
use App\Http\Requests\UpdateWalletRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-wallets')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view wallets.');
        }

        $wallets = Wallet::all();
        return Inertia::render('Dashboard/Wallets/Index', [
            'wallets' => $wallets,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWalletRequest $request)
    {
        //
        $validatedData = $request->validated();
        try {
            $wallet = Wallet::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'] ?? null,
            ]);

            return redirect()->route('wallets.index')
                ->with('success', 'Wallet created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create wallet: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Wallet $wallet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Wallet $wallet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWalletRequest $request, Wallet $wallet)
    {
        //
        $validatedData = $request->validated();
        try {
            $wallet->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'] ?? null,
            ]);

            return redirect()->route('wallets.index')
                ->with('success', 'Wallet updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to update wallet: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Wallet $wallet)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('delete-wallets')) {
            return redirect()->route('wallets.index')
                ->with('error', 'You do not have permission to delete wallets.');
        }
        try {
            $wallet->delete();
            return redirect()->route('wallets.index')
                ->with('success', 'Wallet deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete wallet: ' . $e->getMessage());
        }
    }
}
