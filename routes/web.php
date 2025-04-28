<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\OfferController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(PageController::class)->group(function () {
    Route::get('/', 'welcome')->name('welcome');
    Route::get('/about', 'about')->name('about');
    Route::get('/products', 'products')->name('products');
    Route::get('/products/{slug}', 'product')->name('product');
});

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');
    Route::prefix('/products/{product}/productPrices')->group(function () {
        Route::get('/create', [ProductController::class, 'createProductPrice'])->name('products.productPrices.create');
        Route::post('/store', [ProductController::class, 'storeProductPrice'])->name('products.productPrices.store');
        Route::get('/{productPrice}/edit', [ProductController::class, 'editProductPrice'])->name('products.productPrices.edit');
        Route::put('/{productPrice}', [ProductController::class, 'updateProductPrice'])->name('products.productPrices.update');
        Route::delete('/{productPrice}', [ProductController::class, 'destroyProductPrice'])->name('products.productPrices.destroy');
    });
    Route::resource('products', ProductController::class);

    Route::get('/offers', [OfferController::class, 'index'])->name('offers.index');
    Route::get('/offers/{offer}', [OfferController::class, 'show'])->name('offers.show');
    Route::post('/offers/{offer}/accept', [OfferController::class, 'accept'])->name('offers.accept');
    Route::post('/offers/{offer}/reject', [OfferController::class, 'reject'])->name('offers.reject');

    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscriptions/{subscription}', [SubscriptionController::class, 'show'])->name('subscriptions.show');
    Route::post('/subscriptions/{subscription}/approve', [SubscriptionController::class, 'approve'])->name('subscriptions.approve');
    Route::post('/subscriptions/{subscription}/reject', [SubscriptionController::class, 'reject'])->name('subscriptions.reject');
    Route::post('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');

    Route::get('/leads', [LeadController::class, 'index'])->name('leads.index');
    Route::get('/leads/{user}', [LeadController::class, 'show'])->name('leads.show');
    Route::get('/leads/{user}/offers', [LeadController::class, 'offers'])->name('leads.offers');
    Route::post('/leads/{user}/offers', [LeadController::class, 'storeOffers'])->name('leads.storeOffers');

    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::get('/sales/{user}', [SalesController::class, 'show'])->name(name: 'sales.show');
    Route::get('/sales/create', [SalesController::class, 'create'])->name('sales.create');
    Route::post('/sales/store', [SalesController::class, 'store'])->name('sales.store');
    Route::get('/sales/{user}/edit', [SalesController::class, 'edit'])->name('sales.edit');
    Route::put('/sales/{user}', [SalesController::class, 'update'])->name('sales.update');
    Route::delete('/sales/{user}', [SalesController::class, 'destroy'])->name('sales.destroy');

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/{user}', [CustomerController::class, 'show'])->name('customers.show');

    Route::get('/managers', [ManagerController::class, 'index'])->name('managers.index');
    Route::get('/managers/{user}', [ManagerController::class, 'show'])->name('managers.show');

    Route::resource('categories', CategoryController::class);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/subscriptions/apply', [SubscriptionController::class, 'apply'])->name('subscriptions.apply');

    // Main section
    Route::get('/customers', function () {
        return Inertia::render('Customers/Index');
    })->name('customers');

    Route::get('/messages', function () {
        return Inertia::render('Messages/Index');
    })->name('messages');

    Route::get('/calendar', function () {
        return Inertia::render('Calendar/Index');
    })->name('calendar');

    Route::get('/documents', function () {
        return Inertia::render('Documents/Index');
    })->name('documents');

    // Reports section
    Route::get('/analytics', function () {
        return Inertia::render('Analytics/Index');
    })->name('analytics');

    Route::get('/analytics/sales', function () {
        return Inertia::render('Analytics/Sales');
    })->name('analytics.sales');

    Route::get('/analytics/customers', function () {
        return Inertia::render('Analytics/Customers');
    })->name('analytics.customers');

    Route::get('/analytics/performance', function () {
        return Inertia::render('Analytics/Performance');
    })->name('analytics.performance');

    // Settings section
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings');

    Route::get('/support', function () {
        return Inertia::render('Support/Index');
    })->name('support');
});

require __DIR__ . '/auth.php';
