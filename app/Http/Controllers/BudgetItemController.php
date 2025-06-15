<?php

namespace App\Http\Controllers;

use App\Models\BudgetItem;
use App\Models\BudgetPlan;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetItemRequest;
use App\Http\Requests\UpdateBudgetItemRequest;
use Illuminate\Support\Facades\Redirect;

class BudgetItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBudgetItemRequest $request, BudgetPlan $budgetPlan)
    {
        //
        $validatedData = $request->validated();
        try {
            $budgetPlan->budgetItems()->create(
                [
                    'name' => $validatedData['name'],
                    'amount' => $validatedData['amount'],
                    'description' => $validatedData['description'] ?? null,
                    'status' => 'planned',
                ]
            );
            return Redirect::back()->with('success', 'Budget item berhasil ditambahkan.');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error creating budget item', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBudgetItemRequest $request, BudgetItem $budgetItem)
    {
        //
        $validatedData = $request->validated();
        try {
            $budgetItem->update([
                'name' => $validatedData['name'],
                'amount' => $validatedData['amount'],
                'description' => $validatedData['description'] ?? null,
                'status' => $validatedData['status'],
            ]);
            return Redirect::back()->with('success', 'Budget item berhasil diperbarui.');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating budget item', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BudgetItem $budgetItem)
    {
        //
        try {
            $budgetItem->delete();
            return Redirect::back()->with('success', 'Budget item berhasil dihapus.');
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting budget item', 'error' => $e->getMessage()], 500);
        }
    }
}
