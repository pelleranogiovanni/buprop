<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use App\Models\Neighborhood;

class PublishController extends Controller
{
    public function create()
    {
        $neighborhoods = Neighborhood::getByCity('Villa Ángela');
        
        return Inertia::render('Publish/Create', [
            'neighborhoods' => $neighborhoods
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_type' => 'required|in:house,apartment,commercial',
            'address' => 'required|string|max:255',
            'neighborhood_id' => 'required|exists:neighborhoods,neighborhood_id',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:1',
            'rooms' => 'required|integer|min:1',
            'covered_m2' => 'required|numeric|min:1',
            'total_m2' => 'required|numeric|min:1',
            'amenities' => 'array',
            'operation_type' => 'required|in:rent,sale',
            'price' => 'required|numeric|min:1',
            'currency' => 'required|in:ARS,USD',
            'requirements' => 'nullable|string',
        ]);

        $villaAngelaCityId = DB::table('cities')->where('name', 'Villa Ángela')->first()->city_id;
        
        // Crear propiedad
        $propertyId = Str::uuid();
        DB::table('properties')->insert([
            'property_id' => $propertyId,
            'owner_id' => auth()->id(),
            'property_type' => $request->property_type,
            'address' => $request->address,
            'city_id' => $villaAngelaCityId,
            'neighborhood_id' => $request->neighborhood_id,
            'bedrooms' => $request->bedrooms,
            'bathrooms' => $request->bathrooms,
            'rooms' => $request->rooms,
            'covered_m2' => $request->covered_m2,
            'total_m2' => $request->total_m2,
            'amenities' => json_encode($request->amenities ?? []),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Crear listing
        DB::table('listings')->insert([
            'listing_id' => Str::uuid(),
            'property_id' => $propertyId,
            'publisher_id' => auth()->id(),
            'operation_type' => $request->operation_type,
            'price' => $request->price,
            'currency' => $request->currency,
            'availability_status' => 'available',
            'moderation_status' => 'pending',
            'requirements' => $request->requirements,
            'available_from' => now(),
            'allow_messages' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return redirect()->route('dashboard')->with('success', 'Propiedad publicada exitosamente. Está pendiente de moderación.');
    }
}