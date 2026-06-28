<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\SearchPreference;
use Illuminate\Support\Collection;

class PropertyComparisonService
{
    private const OPERATION_LABELS = ['rent' => 'Alquiler', 'sale' => 'Venta'];

    private const PROPERTY_TYPE_LABELS = [
        'house' => 'Casa',
        'apartment' => 'Departamento',
        'commercial' => 'Local comercial',
    ];

    private const DISCLAIMER = 'Esta recomendación es orientativa y se basa en los datos disponibles de las publicaciones y tus preferencias registradas. La decisión final es tuya.';

    /**
     * Chips de preferencias para el resumen del comparador.
     */
    public function summarizePreferences(SearchPreference $preference): array
    {
        $chips = [];

        if ($preference->operation_type) {
            $chips[] = self::OPERATION_LABELS[$preference->operation_type] ?? $preference->operation_type;
        }
        if ($preference->property_type) {
            $chips[] = self::PROPERTY_TYPE_LABELS[$preference->property_type] ?? $preference->property_type;
        }

        $location = $preference->city?->name;
        if ($preference->neighborhood?->name) {
            $location = trim(($location ? "{$location} – " : '') . $preference->neighborhood->name);
        }
        if ($location) {
            $chips[] = $location;
        }

        if ($preference->max_price) {
            $chips[] = 'Hasta AR$ ' . number_format((float) $preference->max_price, 0, ',', '.');
        }
        if ($preference->min_bedrooms) {
            $chips[] = "{$preference->min_bedrooms} o más dormitorios";
        }
        if ($preference->needs_patio) {
            $chips[] = 'Patio';
        }
        if ($preference->needs_garage) {
            $chips[] = 'Garaje/cochera';
        }
        if ($preference->requires_pets_allowed) {
            $chips[] = 'Acepta mascotas';
        }

        return ['chips' => $chips];
    }

    /**
     * Ajuste estructurado determinístico de cada propiedad contra las preferencias.
     */
    public function buildFit(Collection $listings, SearchPreference $preference): array
    {
        return $listings->map(function (Listing $listing) use ($preference) {
            $property = $listing->property;

            $cells = [
                'operation_type' => $preference->operation_type
                    ? $listing->operation_type === $preference->operation_type
                    : true,
                'property_type' => $preference->property_type
                    ? $property->property_type === $preference->property_type
                    : true,
                'budget' => $preference->max_price
                    ? (float) $listing->price <= (float) $preference->max_price
                    : true,
                'bedrooms' => $preference->min_bedrooms
                    ? (int) $property->bedrooms >= (int) $preference->min_bedrooms
                    : true,
                'patio' => (bool) $property->has_patio,
                'garage' => (bool) $property->has_garage,
                'pets' => (bool) $listing->allows_pets,
            ];

            return [
                'listing_id'  => $listing->listing_id,
                'title'       => $property->title,
                'price'       => (float) $listing->price,
                'cells'       => $cells,
                'match_count' => $this->countMatches($cells, $preference),
            ];
        })->values()->all();
    }

    /**
     * Análisis por reglas (fallback cuando la IA no está disponible o falla).
     */
    public function fallbackAnalysis(Collection $listings, SearchPreference $preference, array $fit): array
    {
        $recommended = $this->pickRecommended($fit, $preference);

        $highlights = collect($fit)->map(function (array $row) use ($preference, $recommended) {
            $overBudget = $preference->max_price && ! $row['cells']['budget'];
            $isRecommended = $row['listing_id'] === $recommended['listing_id'];

            return [
                'listing_id' => $row['listing_id'],
                'title'      => $row['title'],
                'text'       => $this->describe($row),
                'tone'       => $isRecommended ? 'positive' : ($overBudget ? 'warning' : 'neutral'),
            ];
        })->values()->all();

        return [
            'summary' => "La propiedad que mejor se ajusta a tus preferencias es \"{$recommended['title']}\", "
                . 'según la coincidencia con el tipo de operación, tipo de propiedad, presupuesto, dormitorios y comodidades registradas.',
            'highlights' => $highlights,
            'recommended_listing_id' => $recommended['listing_id'],
            'recommendation' => "Según tus preferencias cargadas, \"{$recommended['title']}\" aparece como la alternativa más alineada para revisar primero.",
            'disclaimer' => self::DISCLAIMER,
            'source' => 'fallback',
        ];
    }

    public function disclaimer(): string
    {
        return self::DISCLAIMER;
    }

    /**
     * Valida y normaliza la respuesta de la IA contra el set comparado.
     * Devuelve null si la respuesta es inválida (para usar fallback).
     */
    public function normalizeAiAnalysis(?array $ai, array $fit): ?array
    {
        if (! $ai) {
            return null;
        }

        $validIds = collect($fit)->pluck('listing_id')->all();
        $byId = collect($fit)->keyBy('listing_id');

        $summary = trim((string) ($ai['summary'] ?? ''));
        $recommendation = trim((string) ($ai['recommendation'] ?? ''));
        $recommendedId = (string) ($ai['recommended_property_id'] ?? $ai['recommended_listing_id'] ?? '');

        if ($summary === '' || $recommendation === '' || ! in_array($recommendedId, $validIds, true)) {
            return null;
        }

        $highlights = collect($ai['highlights'] ?? [])
            ->map(function ($hl) use ($validIds, $byId) {
                $id = (string) ($hl['property_id'] ?? $hl['listing_id'] ?? '');
                $text = trim((string) ($hl['text'] ?? ''));
                if ($text === '' || ! in_array($id, $validIds, true)) {
                    return null;
                }

                return [
                    'listing_id' => $id,
                    'title'      => $byId[$id]['title'],
                    'text'       => $text,
                    'tone'       => $this->toneFor($byId[$id]['match_count']),
                ];
            })
            ->filter()
            ->values()
            ->all();

        if (empty($highlights)) {
            return null;
        }

        return [
            'summary' => $summary,
            'highlights' => $highlights,
            'recommended_listing_id' => $recommendedId,
            'recommendation' => $recommendation,
            'disclaimer' => self::DISCLAIMER,
            'source' => 'ai',
        ];
    }

    private function countMatches(array $cells, SearchPreference $preference): int
    {
        $count = 0;
        if ($preference->operation_type && $cells['operation_type']) $count++;
        if ($preference->property_type && $cells['property_type']) $count++;
        if ($preference->max_price && $cells['budget']) $count++;
        if ($preference->min_bedrooms && $cells['bedrooms']) $count++;
        if ($preference->needs_patio && $cells['patio']) $count++;
        if ($preference->needs_garage && $cells['garage']) $count++;
        if ($preference->requires_pets_allowed && $cells['pets']) $count++;

        return $count;
    }

    private function pickRecommended(array $fit, SearchPreference $preference): array
    {
        $rows = collect($fit);
        $maxMatches = $rows->max('match_count');
        $top = $rows->where('match_count', $maxMatches);

        if ($top->count() === 1) {
            return $top->first();
        }

        // Empate: priorizar dentro del presupuesto y menor precio, luego tipo de propiedad.
        $withinBudget = $top->filter(fn ($r) => $r['cells']['budget']);
        $pool = $withinBudget->isNotEmpty() ? $withinBudget : $top;

        return $pool->sortBy('price')->first();
    }

    private function toneFor(int $matchCount): string
    {
        if ($matchCount >= 5) return 'positive';
        if ($matchCount >= 3) return 'neutral';

        return 'warning';
    }

    private function describe(array $row): string
    {
        $cells = $row['cells'];
        $pros = [];
        $cons = [];

        if ($cells['budget']) $pros[] = 'presupuesto'; else $cons[] = 'supera el presupuesto';
        if ($cells['property_type']) $pros[] = 'tipo de propiedad';
        if ($cells['bedrooms']) $pros[] = 'dormitorios';
        if ($cells['patio']) $pros[] = 'patio';
        if ($cells['garage']) $pros[] = 'garaje';
        if (! $cells['patio'] && ! $cells['garage']) $cons[] = 'sin patio ni garaje';

        $text = "{$row['title']}: ";
        $text .= $pros ? 'coincide con ' . implode(', ', $pros) : 'coincidencias limitadas con tus preferencias';
        if ($cons) {
            $text .= '; ' . implode(', ', $cons);
        }

        return $text . '.';
    }
}
