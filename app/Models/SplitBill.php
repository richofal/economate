<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SplitBill extends Model
{
    protected $table = 'split_bills';
    //
    protected $fillable = [
        'title',
        'total_amount',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Define relationships if needed
    public function items()
    {
        return $this->hasMany(SplitBillItem::class);
    }

    public function participants()
    {
        return $this->hasMany(SplitBillParticipant::class);
    }
}
