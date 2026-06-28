<?php

namespace App\Http\Controllers;

use App\Http\Requests\AnalyzeComparisonRequest;
use App\Models\Listing;
use App\Services\ComparisonAiService;
use App\Services\PropertyComparisonService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class ComparisonController extends Controller
{
    public function __construct(
        private readonly PropertyComparisonService $comparisonService,
        private readonly ComparisonAiService $aiService,
    ) {}

    public function index(): Response
    {
        $user = auth()->user();
        $preference = $user?->hasRole('tenant')
            ? $user->searchPreference()->with(['city', 'neighborhood'])->first()
            : null;

        $aiEnabled = $preference !== null;

        return Inertia::render('Compare', [
            'aiEnabled' => $aiEnabled,
            'preferences' => $aiEnabled
                ? $this->comparisonService->summarizePreferences($preference)
                : null,
        ]);
    }

    public function analyze(AnalyzeComparisonRequest $request): JsonResponse
    {
        $user = $request->user();
        $preference = $user->searchPreference()->with(['city', 'neighborhood'])->firstOrFail();

        $listings = Listing::with(['property.city', 'property.neighborhood'])
            ->available()
            ->whereIn('listing_id', $request->validated('listing_ids'))
            ->get();

        if ($listings->count() < 2) {
            return response()->json([
                'error' => 'No hay suficientes propiedades disponibles para comparar.',
            ], 422);
        }

        $fit = $this->comparisonService->buildFit($listings, $preference);
        $analysis = $this->aiService->analyze($listings, $preference, $fit);

        return response()->json([
            'structuredFit' => $fit,
            'analysis' => $analysis,
        ]);
    }
}
