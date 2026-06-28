<?php

namespace App\Http\Controllers\Onboarding;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Neighborhood;
use App\Models\SearchPreference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PreferencesController extends Controller
{
    public function show()
    {
        if (! auth()->user()->hasRole('tenant')) {
            return redirect()->route('home');
        }

        $neighborhoods = Neighborhood::getByCity('Villa Ángela');

        return Inertia::render('Onboarding/Preferences', [
            'neighborhoods' => $neighborhoods,
        ]);
    }

    public function store(Request $request)
    {
        if (! auth()->user()->hasRole('tenant')) {
            return redirect()->route('home');
        }

        $request->validate([
            'operation_type'  => 'required|string|in:rent,sale',
            'property_type'   => 'nullable|string|in:house,apartment,land,commercial',
            'neighborhood_id' => 'nullable|exists:neighborhoods,neighborhood_id',
            'min_price'       => 'nullable|numeric|min:0',
            'max_price'       => 'nullable|numeric|min:0|gte:min_price',
            'bedrooms'        => 'nullable|integer|min:0|max:20',
            'bathrooms'       => 'nullable|integer|min:0|max:20',
            'rooms'           => 'nullable|integer|min:0|max:30',
            'amenities'       => 'nullable|array',
            'amenities.*'     => 'string',
            'conditions'      => 'nullable|array',
            'conditions.*'    => 'string',
            'notes'           => 'nullable|string|max:1000',
        ]);

        $amenities  = $request->input('amenities', []);
        $conditions = $request->input('conditions', []);

        $city = City::where('name', 'Villa Ángela')->first();

        SearchPreference::updateOrCreate(
            ['user_id' => auth()->id()],
            [
                'city_id'                  => $city?->city_id,
                'neighborhood_id'          => $request->neighborhood_id ?: null,
                'operation_type'           => $request->operation_type,
                'property_type'            => $request->property_type,
                'min_price'                => $request->min_price ?: null,
                'max_price'                => $request->max_price ?: null,
                'min_rooms'                => $request->rooms ?: null,
                'min_bedrooms'             => $request->bedrooms ?: null,
                'min_bathrooms'            => $request->bathrooms ?: null,
                'needs_patio'              => in_array('patio', $amenities),
                'needs_garage'             => in_array('garage', $amenities),
                'requires_pets_allowed'    => in_array('pet_friendly', $amenities),
                'requires_children_allowed'=> in_array('family', $amenities),
                'has_income_proof'         => in_array('payslip', $conditions),
                'has_guarantor'            => in_array('guarantor', $conditions),
                'notes'                    => $request->notes,
            ]
        );

        return redirect()->route('properties.index');
    }
}
