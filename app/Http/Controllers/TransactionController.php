<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\UserWallet;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-transactions')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view-transactions.');
        }
        $query = Transaction::with([
            'userWallet.user:id,name',
            'userWallet.wallet:id,name'
        ]);

        if ($user->hasRole('user')) {
            $query->whereHas('userWallet', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            });
        }

        $transactions = $query->latest('date')->get();

        return Inertia::render('Dashboard/Transactions/Index', [
            'transactions' => $transactions,
            'isAdmin' => $user->hasRole('admin'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-transactions')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view-transactions.');
        }
        $userWallets = $user->userWallets()->with('wallet:id,name')->get();

        return Inertia::render('Dashboard/Transactions/Create', [
            'userWallets' => $userWallets,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        //
        $validated = $request->validated();
        try {
            $userWallet = UserWallet::find($validated['user_wallet_id']);
            if ($validated['type'] === 'debit') {
                if ($userWallet->balance < $validated['amount']) {
                    return back()->withErrors(['amount' => 'Jumlah pengeluaran melebihi saldo yang tersedia.']);
                }
                $userWallet->balance -= $validated['amount'];
            } else {
                $userWallet->balance += $validated['amount'];
            }

            $userWallet->transactions()->create([
                'type' => $validated['type'],
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'date' => $validated['date'],
            ]);
            $userWallet->save();
            return redirect()->route('transactions.index')->with('success', 'Transaction created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating transaction', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()->with('error', 'Failed to create transaction: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        //
        Gate::authorize('view', $transaction);

        $transaction->load(['userWallet.user:id,name', 'userWallet.wallet:id,name']);
        return Inertia::render('Dashboard/Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->hasPermissionTo('update-transactions')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to edit transactions.');
        }

        $user = $transaction->userWallet->user;

        $transaction->load(['userWallet.user:id,name', 'userWallet.wallet:id,name']);
        $userWallets = $user->userWallets()->with('wallet:id,name')->get();
        return Inertia::render('Dashboard/Transactions/Edit', [
            'transaction' => $transaction,
            'userWallets' => $userWallets,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {

        $validated = $request->validated();
        try {
            DB::transaction(function () use ($transaction, $validated) {
                $originalWallet = $transaction->userWallet;
                if ($transaction->type === 'credit') {
                    $originalWallet->balance -= $transaction->amount;
                } else {
                    $originalWallet->balance += $transaction->amount;
                }
                $originalWallet->save();
                $newWallet = ($originalWallet->id == $validated['user_wallet_id'])
                    ? $originalWallet
                    : UserWallet::find($validated['user_wallet_id']);

                if ($validated['type'] === 'credit') {
                    $newWallet->balance += $validated['amount'];
                } else {
                    if ($newWallet->balance < $validated['amount']) {
                        throw new \Exception('Saldo pada dompet tujuan tidak mencukupi.');
                    }
                    $newWallet->balance -= $validated['amount'];
                }

                $newWallet->save();

                $transaction->update([
                    'user_wallet_id' => $newWallet->id,
                    'amount' => $validated['amount'],
                    'type' => $validated['type'],
                    'description' => $validated['description'],
                    'date' => $validated['date'],
                ]);
            });
        } catch (\Exception $e) {
            return back()->withErrors(['amount' => $e->getMessage()])->withInput();
        }
        return Redirect::route('transactions.show', $transaction->id)->with('success', 'Transaksi berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('delete-transactions')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to delete transactions.');
        }
        try {
            $transaction->delete();
            return redirect()->route('transactions.index')->with('success', 'Transaction deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting transaction', [
                'transaction_id' => $transaction->id,
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()->with('error', 'Failed to delete transaction: ' . $e->getMessage());
        }
    }
}
