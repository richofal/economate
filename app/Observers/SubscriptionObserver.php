<?php

namespace App\Observers;

use App\Models\Subscription;


class SubscriptionObserver
{
    //
    public function created(Subscription $subscription)
    {
        $user = $subscription->user;

        if ($user->hasRole('lead')) {
            $user->removeRole('lead');
            $user->assignRole('customer');
        } elseif (!$user->hasAnyRole(['sales', 'manager', 'customer'])) {
            $user->assignRole('customer');
        }
    }
}
