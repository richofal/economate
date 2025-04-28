<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    //
    public function welcome()
    {
        return Inertia::render('Welcome/Index', [
            'canLogin' => route('login') !== null,
            'canRegister' => route('register') !== null,
            'laravelVersion' => app()->version(),
            'phpVersion' => PHP_VERSION,
        ]);
    }

    public function about()
    {
        return Inertia::render('About/Index');
    }

    public function products()
    {
        // Load products with eager loading for related data
        $products = Product::with([
            'productPrices',  // Pastikan ini sesuai dengan nama relasi di model Product
            'category',
        ])
            ->where('is_active', true)  // Hanya tampilkan produk aktif
            ->orderBy('is_featured', 'desc')  // Tampilkan produk unggulan lebih dulu
            ->get();

        $categories = Category::select(['id', 'name'])
            ->whereHas('products', function ($query) {
                $query->where('is_active', true);
            })
            ->orderBy('name')
            ->get();

        return Inertia::render(
            'Products/Index',
            [
                'products' => $products,
                'categories' => $categories,
            ]
        );
    }

    public function product(String $slug)
    {
        // Find the product by its code (slug)
        $product = Product::where('code', $slug)
            ->where('is_active', true)
            ->with([
                'category',
                'productPrices'
            ])
            ->firstOrFail();


        // Get related products in the same category
        $relatedProducts = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->with(['productPrices'])
            ->orderBy('is_featured', 'desc')
            ->limit(3)
            ->get();

        // Get a list of popular products (could be based on views or other metrics)
        $popularProducts = Product::where('is_active', true)
            ->where('is_featured', true)
            ->where('id', '!=', $product->id)
            ->with(['productPrices'])
            ->inRandomOrder()
            ->limit(2)
            ->get();

        return Inertia::render('Products/Show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
            'popularProducts' => $popularProducts,
        ]);
    }
}
