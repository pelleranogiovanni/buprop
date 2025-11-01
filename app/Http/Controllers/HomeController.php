<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Listing;
use App\Models\Neighborhood;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['operation_type', 'property_type', 'neighborhood_id', 'min_price', 'max_price', 'bedrooms']);
        
        $listings = Listing::getAvailableListings($filters);
        $neighborhoods = Neighborhood::getByCity('Villa Ángela');
        
        return Inertia::render('Home', [
            'listings' => $listings,
            'neighborhoods' => $neighborhoods,
            'filters' => $filters
        ]);
    }
}