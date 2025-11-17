<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Query base
        $query = DB::table('listings')
            ->join('properties', 'listings.property_id', '=', 'properties.property_id')
            ->join('cities', 'properties.city_id', '=', 'cities.city_id')
            ->leftJoin('neighborhoods', 'properties.neighborhood_id', '=', 'neighborhoods.neighborhood_id')
            ->join('users', 'listings.publisher_id', '=', 'users.id')
            ->leftJoin('property_images', function($join) {
                $join->on('properties.property_id', '=', 'property_images.property_id')
                     ->where('property_images.is_cover', '=', true);
            })
            ->select([
                'listings.listing_id',
                'listings.operation_type',
                'listings.price',
                'listings.currency',
                'listings.availability_status',
                'listings.moderation_status',
                'listings.created_at',
                'properties.property_type',
                'properties.address',
                'properties.bedrooms',
                'properties.bathrooms',
                'properties.covered_m2',
                'cities.name as city_name',
                'neighborhoods.name as neighborhood_name',
                'users.name as publisher_name',
                'property_images.url as cover_image'
            ]);
        
        // Si no es admin, solo mostrar sus publicaciones
        if (!$user->hasRole('admin')) {
            $query->where('listings.publisher_id', $user->id);
        }
        
        $listings = $query->orderBy('listings.created_at', 'desc')
            ->get()
            ->map(function ($listing) {
                return (array) $listing;
            })
            ->toArray();

        return Inertia::render('dashboard', [
            'listings' => $listings,
            'auth' => [
                'user' => $user->load('roles')
            ]
        ]);
    }

    public function updateModeration(Request $request, $listingId)
    {
        $user = auth()->user();
        
        if (!$user->hasRole('admin')) {
            abort(403);
        }
        
        $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);
        
        DB::table('listings')
            ->where('listing_id', $listingId)
            ->update(['moderation_status' => $request->status]);
        
        return back();
    }
}