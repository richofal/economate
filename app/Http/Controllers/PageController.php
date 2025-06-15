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

    public function services()
    {
        return Inertia::render('Services/Index');
    }
}
