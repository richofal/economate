<?php

namespace App\Http\Controllers;

use App\Models\SplitBill;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSplitBillRequest;
use App\Http\Requests\UpdateSplitBillRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class SplitBillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-split-bills')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view split bills.');
        }
        $isAdmin = $user->hasRole('admin');
        if ($isAdmin) {
            $splitBills = SplitBill::orderBy('created_at', 'desc')->get();
        } else {
            $splitBills = SplitBill::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')->get();
        }
        return Inertia::render('Dashboard/SplitBills/Index', [
            'splitBills' => $splitBills,
            'isAdmin' => $isAdmin,
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
        if (!$user->hasPermissionTo('create-split-bills')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to create split bills.');
        }

        return Inertia::render('Dashboard/SplitBills/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSplitBillRequest $request)
    {
        //
        $validated = $request->validated();
        try {
            SplitBill::create([
                'user_id' => Auth::id(),
                'title' => $validated['title'],
            ]);
            return redirect()->route('splitBills.index')
                ->with('status', 'Split bill created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create split bill: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(SplitBill $splitBill)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-split-bills')) {
            return redirect()->route('splitBills.index')
                ->with('error', 'You do not have permission to view this split bill.');
        }
        $splitBill->load(['user:id,name', 'items', 'participants']);
        return Inertia::render('Dashboard/SplitBills/Show', [
            'splitBill' => $splitBill,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SplitBill $splitBill)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('update-split-bills')) {
            return redirect()->route('splitBills.index')
                ->with('error', 'You do not have permission to edit this split bill.');
        }
        $splitBill->load('items', 'participants');
        return Inertia::render('Dashboard/SplitBills/Edit', [
            'splitBill' => $splitBill,
            'items' => $splitBill->items,
            'participants' => $splitBill->participants,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSplitBillRequest $request, SplitBill $splitBill)
    {
        //
        $request->validated();
        try {
            DB::transaction(function () use ($request, $splitBill) {

                $totalAmount = collect($request->items)->reduce(function ($sum, $item) {
                    $price = floatval($item['price']);
                    $quantity = intval($item['quantity'] ?? 1);
                    return $sum + ($price * $quantity);
                }, 0);

                $splitBill->update([
                    'title' => $request->title,
                    'total_amount' => $totalAmount,
                ]);

                $splitBill->items()->delete();
                $itemsData = collect($request->items)->map(function ($item) {
                    return [
                        'name' => $item['name'],
                        'price' => $item['price'],
                        'quantity' => $item['quantity'] ?? 1,
                    ];
                })->toArray();
                $splitBill->items()->createMany($itemsData);

                $splitBill->participants()->delete();
                $participantsData = collect($request->participants)->map(function ($participant) {
                    return [
                        'name' => $participant['name'],
                        'amount_owed' => $participant['amount_owed'],
                    ];
                })->toArray();
                $splitBill->participants()->createMany($participantsData);
            });

            return redirect()->route('splitBills.index')
                ->with('status', 'Split bill updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating split bill', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return redirect()->back()
                ->with('error', 'Failed to update split bill: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SplitBill $splitBill)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('delete-split-bills')) {
            return redirect()->route('splitBills.index')
                ->with('error', 'You do not have permission to delete this split bill.');
        }
        try {
            $splitBill->delete();
            return redirect()->route('splitBills.index')
                ->with('status', 'Split bill deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete split bill: ' . $e->getMessage());
        }
    }
}
