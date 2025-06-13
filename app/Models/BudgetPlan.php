<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetPlan extends Model
{
    /** @use HasFactory<\Database\Factories\BudgetPlanFactory> */
    use HasFactory;

    protected $table = 'budget_plans';

    protected $fillable = [
        'user_id',
        'name',
        'description',
        'start_date',
        'end_date',
        'total_budget',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'total_budget' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function budgetItems()
    {
        return $this->hasMany(BudgetItem::class);
    }
}
