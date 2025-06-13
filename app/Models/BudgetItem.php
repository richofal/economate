<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetItem extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetItemFactory> */
    use HasFactory;

    protected $table = 'budget_items';

    protected $fillable = [
        'budget_plan_id',
        'name',
        'description',
        'amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function budgetPlan()
    {
        return $this->belongsTo(BudgetPlan::class);
    }
}
