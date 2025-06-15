<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBillItem extends Model
{
    //
    protected $table = 'split_bill_items';

    protected $fillable = [
        'split_bill_id',
        'name',
        'price',
        'quantity',
    ];

    // Define relationships if needed
    public function splitBill()
    {
        return $this->belongsTo(SplitBill::class);
    }
}
