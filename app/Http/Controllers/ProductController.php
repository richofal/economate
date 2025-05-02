<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\StoreProductPriceRequest;
use App\Http\Requests\UpdateProductPriceRequest;
use App\Http\Resources\CategoryCollection;
use App\Http\Resources\ProductCollection;
use App\Models\Category;
use App\Models\ProductPrice;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Check permissions
        $this->authorize('view-products');
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $categories = Category::all();

        if ($user->hasRole('admin')) {
            $products = Product::with(['category', 'productPrices'])->latest()->get();
        } elseif ($user->hasRole('manager')) {
            // Managers see all active products
            $products = Product::with(['category', 'productPrices'])
                ->where('is_active', true)
                ->latest()
                ->get();
        } elseif ($user->hasRole(['sales', 'customer', 'lead'])) {
            // Sales, customers and leads only see active products that are featured or in their category
            $products = Product::with(['category', 'productPrices'])
                ->where('is_active', true)
                ->latest()
                ->get();
        } else {
            // Default case (shouldn't normally be reached)
            $products = collect([]);
        }

        // Return Inertia view with product collection resource
        return Inertia('Dashboard/Products/Index', [
            'categories' => $categories,
            'products' => $products,
            'canCreateProduct' => $user->can('create-products'),
            'canEditProduct' => $user->can('edit-products'),
            'canDeleteProduct' => $user->can('delete-products'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $this->authorize('create-products');
        $categories = Category::all();
        return Inertia('Dashboard/Products/Create', [
            'categories' => $categories,
            'canCreateProduct' => true,
        ]);
    }


    /**
     * Store a newly created product in storage.
     *
     * @param  \App\Http\Requests\StoreProductRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreProductRequest $request)
    {
        try {
            // Get validated data from the request
            $validated = $request->validated();

            // Convert boolean fields from string to actual boolean if needed
            $validated['is_recurring'] = (bool)($validated['is_recurring'] ?? false);
            $validated['is_active'] = (bool)($validated['is_active'] ?? true);
            $validated['is_featured'] = (bool)($validated['is_featured'] ?? false);

            // Create the product
            $product = Product::create($validated);

            // Redirect with success message
            return redirect()
                ->route('products.index')
                ->with('success', 'Product created successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Product creation failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create product. Please try again.');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        //
        $this->authorize('view-products');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/Products/Show', [
            'product' => $product,
            'category' => $product->category,
            'productPrices' => $product->productPrices()->get(),
            'created_at_formatted' => $product->created_at->format('F j, Y, g:i a'),
            'updated_at_formatted' => $product->updated_at->format('F j, Y, g:i a'),
            'canCreateProductPrice' => $user->can('create-product-prices'),
            'canEditProductPrice' => $user->can('edit-product-prices'),
            'canDeleteProductPrice' => $user->can('delete-product-prices'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
        $this->authorize('edit-products');
        $categories = Category::all();
        return Inertia('Dashboard/Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'canEditProduct' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product)
    {
        //
        try {
            // Get validated data from the request
            $validated = $request->validated();

            // Convert boolean fields from string to actual boolean if needed
            $validated['is_recurring'] = (bool)($validated['is_recurring'] ?? false);
            $validated['is_active'] = (bool)($validated['is_active'] ?? true);
            $validated['is_featured'] = (bool)($validated['is_featured'] ?? false);

            // Update the product
            $product->update($validated);

            // Redirect with success message
            return redirect()
                ->route('products.index')
                ->with('success', 'Product updated successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Product update failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to update product. Please try again.');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }

    public function createProductPrice(Product $product)
    {
        $this->authorize('create-product-prices');

        // Get existing billing cycles for this product
        $existingBillingCycles = $product->productPrices()
            ->pluck('billing_cycle')
            ->toArray();

        // Define all possible billing cycles
        $allBillingCycles = [
            ['value' => 'monthly', 'label' => 'Monthly'],
            ['value' => 'quarterly', 'label' => 'Quarterly (3 months)'],
            ['value' => 'semi_annual', 'label' => 'Semi-Annual (6 months)'],
            ['value' => 'annual', 'label' => 'Annual (12 months)'],
        ];

        // Filter out existing billing cycles
        $availableBillingCycles = array_filter($allBillingCycles, function ($cycle) use ($existingBillingCycles) {
            return !in_array($cycle['value'], $existingBillingCycles);
        });


        return Inertia('Dashboard/Products/ProductPrices/Create', [
            'product' => $product,
            'canCreateProductPrice' => true,
            'availableBillingCycles' => array_values($availableBillingCycles), // Reset array keys
        ]);
    }

    public function storeProductPrice(StoreProductPriceRequest $request, Product $product)
    {
        //
        $this->authorize('create-product-prices');
        try {
            // Get validated data from the request
            $validated = $request->validated();

            // Create the product price
            $product->productPrices()->create($validated);

            // Redirect with success message
            return redirect()
                ->route('products.show', ['product' => $product])
                ->with('success', 'Product price created successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Product price creation failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to create product price. Please try again.');
        }
    }
    public function editProductPrice(Product $product, ProductPrice $productPrice)
    {
        //
        $this->authorize('edit-product-prices');

        if ($productPrice->product_id !== $product->id) {
            return redirect()
                ->route('products.show', $product)
                ->with('error', 'The price plan does not belong to this product.');
        }
        try {
            // Get billing cycle information for display
            $billingCycleLabels = [
                'monthly' => 'Monthly',
                'quarterly' => 'Quarterly (3 months)',
                'semi_annual' => 'Semi-Annual (6 months)',
                'annual' => 'Annual (12 months)',
            ];

            return Inertia('Dashboard/Products/ProductPrices/Edit', [
                'product' => $product,
                'productPrice' => $productPrice,
                'canEditProductPrice' => true,
                'billingCycleLabel' => $billingCycleLabels[$productPrice->billing_cycle] ?? ucfirst($productPrice->billing_cycle),
                'isDefaultPrice' => $product->productPrices()->count() === 1,
                'formattedCreatedAt' => $productPrice->created_at->format('F j, Y, g:i a'),
            ]);
        } catch (\Exception $e) {
            // Log any errors that occur
            Log::error('Error loading product price edit form: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->route('products.show', $product)
                ->with('error', 'An error occurred while loading the edit form. Please try again.');
        }
    }

    public function updateProductPrice(UpdateProductPriceRequest $request, Product $product, ProductPrice $productPrice)
    {
        //
        $this->authorize('edit-product-prices');
        try {
            // Get validated data from the request
            $validated = $request->validated();

            // Update the product price
            $productPrice->update($validated);

            // Redirect with success message
            return redirect()
                ->route('products.show', ['product' => $product])
                ->with('success', 'Product price updated successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Product price update failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to update product price. Please try again.');
        }
    }

    public function destroyProductPrice(Product $product, ProductPrice $productPrice)
    {
        //
        $this->authorize('delete-product-prices');
        try {
            $productPrice->delete();
            return redirect()
                ->route('products.show', ['product' => $product])
                ->with('success', 'Product price deleted successfully.');
        } catch (\Exception $e) {
            // Log the error
            Log::error('Product price deletion failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()
                ->back()
                ->withInput()
                ->with('error', 'Failed to delete product price. Please try again.');
        }
    }
}
