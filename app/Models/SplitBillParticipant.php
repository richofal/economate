<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBillParticipant extends Model
{
    //
    protected $table = 'split_bill_participants';

    protected $fillable = [
        'split_bill_id',
        'name',
        'amount_owed',
    ];

    public function splitBill()
    {
        return $this->belongsTo(SplitBill::class);
    }
}
