<?php

use App\Http\Controllers\BudgetItemController;
use App\Http\Controllers\BudgetPlanController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SplitBillController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserWalletController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;

Route::controller(PageController::class)->group(function () {
    Route::get('/', 'welcome')->name('welcome');
});

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::prefix('profile')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'index')->name('profile.index');
        Route::get('/edit', 'edit')->name('profile.edit');
        Route::patch('/', 'update')->name('profile.update');
    });
    Route::resource('wallets', WalletController::class);
    Route::resource('users', UserController::class);
    Route::resource('my-wallets', UserWalletController::class)->only(['index', 'show', 'store', 'update', 'destroy'])->names([
        'index' => 'userWallets.index',
        'show' => 'userWallets.show',
        'store' => 'userWallets.store',
        'update' => 'userWallets.update',
        'destroy' => 'userWallets.destroy',
    ])
        ->parameters([
            'my-wallets' => 'userWallet'
        ]);
    Route::resource('transactions', TransactionController::class);
    Route::resource('splitBills', SplitBillController::class);
    Route::resource('budgetPlans', BudgetPlanController::class);
    Route::resource('budgetPlans.budgetItems', BudgetItemController::class)
        ->shallow()
        ->only(['store', 'update', 'destroy']);
});

require __DIR__ . '/auth.php';
