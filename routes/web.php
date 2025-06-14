<?php


use App\Http\Controllers\PageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserWalletController;
use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use Inertia\Inertia;

Route::controller(PageController::class)->group(function () {
    Route::get('/', 'welcome')->name('welcome');
});

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');
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
});

Route::middleware('auth')->group(function () {});

require __DIR__ . '/auth.php';
