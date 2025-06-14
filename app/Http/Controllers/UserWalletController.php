<?php

namespace App\Http\Controllers;

use App\Models\UserWallet;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserWalletRequest;
use App\Http\Requests\UpdateUserWalletRequest;
use App\Models\Wallet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserWalletController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-user-wallets')) {
            Log::warning('User does not have permission to view user wallets', ['user_id' => $user->id]);
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view user wallets.');
        }

        $userWallets = UserWallet::where('user_id', $user->id)
            ->with('wallet')
            ->orderBy('created_at', 'desc')->get();

        $wallets = Wallet::orderBy('name', 'asc')->get();
        return Inertia::render('Dashboard/UserWallets/Index', [
            'userWallets' => $userWallets,
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
    public function store(StoreUserWalletRequest $request)
    {
        //
        $validated = $request->validated();
        try {
            if (isset($validated['new_wallet_name']) && !empty($validated['new_wallet_name'])) {
                $wallet = Wallet::create(['name' => $validated['new_wallet_name']]);
                $validated['wallet_id'] = $wallet->id;
                UserWallet::create([
                    'user_id' => Auth::id(),
                    'wallet_id' => $validated['wallet_id'],
                    'balance' => $validated['balance'],
                ]);
            } else {
                UserWallet::create([
                    'user_id' => Auth::id(),
                    'wallet_id' => $validated['wallet_id'],
                    'balance' => $validated['balance'],
                ]);
            }

            return redirect()->route('userWallets.index')
                ->with('success', 'User wallet created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating user wallet', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()
                ->with('error', 'Failed to create user wallet. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(UserWallet $userWallet)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(UserWallet $userWallet)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserWalletRequest $request, UserWallet $userWallet)
    {
        //
        $validated = $request->validated();
        try {
            $userWallet->update([
                'balance' => $validated['balance'],
            ]);

            return redirect()->route('userWallets.index')
                ->with('success', 'User wallet updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating user wallet', [
                'user_wallet_id' => $userWallet->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()
                ->with('error', 'Failed to update user wallet. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserWallet $userWallet)
    {
        //
        try {
            $userWallet->delete();
            return redirect()->route('userWallets.index')
                ->with('success', 'User wallet deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting user wallet', [
                'user_wallet_id' => $userWallet->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()
                ->with('error', 'Failed to delete user wallet. Please try again.');
        }
    }
}
