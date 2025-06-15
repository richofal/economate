<?php

namespace App\Http\Controllers;

use App\Models\BudgetPlan;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBudgetPlanRequest;
use App\Http\Requests\UpdateBudgetPlanRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class BudgetPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->hasPermissionTo('view-any-budget-plans')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view budget plans.');
        }

        $isAdmin = $authUser->hasRole('admin');
        if ($isAdmin) {
            $budgetPlans = BudgetPlan::orderBy('created_at', 'desc')->get();
        } else {
            $budgetPlans = BudgetPlan::where('user_id', $authUser->id)
                ->orderBy('created_at', 'desc')->get();
        }
        // Load budget items for each budget plan
        $budgetPlans->load('user');
        return Inertia::render('Dashboard/BudgetPlans/Index', [
            'budgetPlans' => $budgetPlans,
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
        if (!$user->hasPermissionTo('create-budget-plans')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to create budget plans.');
        }

        return Inertia::render('Dashboard/BudgetPlans/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreBudgetPlanRequest $request)
    {
        //

        $validatedData = $request->validated();
        try {
            BudgetPlan::create([
                'user_id' => Auth::id(),
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'start_date' => $validatedData['start_date'],
                'end_date' => $validatedData['end_date'],
                'total_budget' => $validatedData['total_budget'],
            ]);

            return redirect()->route('budgetPlans.index')
                ->with('success', 'Budget plan created successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to create budget plan: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'data' => $validatedData,
            ]);
            return redirect()->back()
                ->with('error', 'Failed to create budget plan: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(BudgetPlan $budgetPlan)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-budget-plans')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view this budget plan.');
        }
        $budgetPlan->load('budgetItems');
        return Inertia::render('Dashboard/BudgetPlans/Show', [
            'budgetPlan' => $budgetPlan,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BudgetPlan $budgetPlan)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('update-budget-plans')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to edit this budget plan.');
        }
        return Inertia::render('Dashboard/BudgetPlans/Edit', [
            'budgetPlan' => $budgetPlan,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateBudgetPlanRequest $request, BudgetPlan $budgetPlan)
    {
        //
        $validatedData = $request->validated();
        try {
            $budgetPlan->update([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'],
                'start_date' => $validatedData['start_date'],
                'end_date' => $validatedData['end_date'],
                'total_budget' => $validatedData['total_budget'],
            ]);
            return redirect()->route('budgetPlans.index')
                ->with('success', 'Budget plan updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update budget plan: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'budget_plan_id' => $budgetPlan->id,
                'data' => $validatedData,
            ]);
            return redirect()->back()
                ->with('error', 'Failed to update budget plan: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BudgetPlan $budgetPlan)
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('delete-budget-plans')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to delete this budget plan.');
        }
        try {
            $budgetPlan->delete();
            return redirect()->route('budgetPlans.index')
                ->with('success', 'Budget plan deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to delete budget plan: ' . $e->getMessage(), [
                'user_id' => Auth::id(),
                'budget_plan_id' => $budgetPlan->id,
            ]);
            return redirect()->back()
                ->with('error', 'Failed to delete budget plan: ' . $e->getMessage());
        }
    }
}
