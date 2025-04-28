<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryCollection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $this->authorize('view-categories');
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $categories = Category::latest()->get();

        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => new CategoryCollection($categories),
            'canCreateCategory' => $user->can('create-categories'),
            'canEditCategory' => $user->can('edit-categories'),
            'canDeleteCategory' => $user->can('delete-categories'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        $this->authorize('create-categories');
        return Inertia('Dashboard/Categories/Create', [
            'canCreateCategory' => true,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        //
        $request->validated();

        try {
            Category::create([
                'name' => $request->name,
                'description' => $request->description,
                'slug' => $this->generateCategorySlug($request->name),
            ]);
            return Redirect::route(route: 'categories.index')->with('success', 'Category created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $this->authorize('view-categories');

        return Inertia::render('Dashboard/Categories/Show', [
            'category' => [
                ...$category->toArray(),
                'products' => $category->products()->with('productPrices')->get(),
                'created_at_formatted' => $category->created_at->format('F j, Y, g:i a'),
                'updated_at_formatted' => $category->updated_at->format('F j, Y, g:i a'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        //
        $this->authorize('edit-categories');
        return Inertia('Dashboard/Categories/Edit', [
            'category' => $category,
            'canEditCategory' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        //
        $request->validated();

        try {
            $category->update([
                'name' => $request->name,
                'description' => $request->description,
                'slug' => $this->generateCategorySlug($request->name),
            ]);
            return Redirect::route(route: 'categories.index')->with('success', 'Category updated successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to update category: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        //
        $this->authorize('delete-categories');
        try {
            $category->delete();
            return Redirect::route(route: 'categories.index')->with('success', 'Category deleted successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to delete category: ' . $e->getMessage());
        }
    }

    private function generateCategorySlug($name)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $count = 1;

        // Check if the slug exists already
        while (Category::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }
}
