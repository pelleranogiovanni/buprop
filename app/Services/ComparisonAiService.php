<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\SearchPreference;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class ComparisonAiService
{
    public function __construct(
        private readonly PropertyComparisonService $comparisonService
    ) {}

    /**
     * Genera la evaluación asistida. Si la IA no está configurada, falla o
     * devuelve datos inválidos, retorna el análisis por reglas (fallback).
     */
    public function analyze(Collection $listings, SearchPreference $preference, array $fit): array
    {
        $config = config('services.ollama');

        if (empty($config['key'])) {
            return $this->comparisonService->fallbackAnalysis($listings, $preference, $fit);
        }

        try {
            $response = Http::timeout($config['timeout'] ?? 25)
                ->withToken($config['key'])
                ->acceptJson()
                ->post($config['url'], [
                    'model' => $config['model'],
                    'system' => $this->systemPrompt(),
                    'prompt' => $this->userPrompt($listings, $preference, $fit),
                    'stream' => false,
                    'format' => 'json',
                    'options' => ['temperature' => 0.2],
                ]);

            if (! $response->successful()) {
                return $this->comparisonService->fallbackAnalysis($listings, $preference, $fit);
            }

            $raw = $response->json('response');
            $decoded = is_array($raw) ? $raw : $this->decodeJson((string) $raw);

            $normalized = $this->comparisonService->normalizeAiAnalysis(
                is_array($decoded) ? $decoded : null,
                $fit
            );

            return $normalized ?? $this->comparisonService->fallbackAnalysis($listings, $preference, $fit);
        } catch (Throwable $e) {
            Log::warning('Ollama comparison analysis failed: ' . $e->getMessage());

            return $this->comparisonService->fallbackAnalysis($listings, $preference, $fit);
        }
    }

    /**
     * Decodifica el JSON devuelto por la IA, tolerando bloques markdown (```json ... ```)
     * o texto adicional alrededor del objeto JSON.
     */
    private function decodeJson(string $raw): ?array
    {
        $clean = trim($raw);

        // Quitar fences de markdown si existen.
        $clean = preg_replace('/^```(?:json)?\s*/i', '', $clean);
        $clean = preg_replace('/\s*```$/', '', $clean);
        $clean = trim($clean);

        $decoded = json_decode($clean, true);
        if (is_array($decoded)) {
            return $decoded;
        }

        // Último recurso: extraer desde la primera { hasta la última }.
        $start = strpos($clean, '{');
        $end = strrpos($clean, '}');
        if ($start !== false && $end !== false && $end > $start) {
            $decoded = json_decode(substr($clean, $start, $end - $start + 1), true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        return null;
    }

    private function systemPrompt(): string
    {
        return <<<'PROMPT'
        Actuá como asistente de comparación de propiedades inmobiliarias.
        Reglas estrictas:
        - Usá solo los datos provistos. No inventes datos.
        - No recomiendes propiedades fuera del listado comparado.
        - La recomendación debe ser orientativa, nunca una decisión definitiva.
        - No menciones porcentajes exactos de compatibilidad.
        - Priorizá la coincidencia con preferencias: presupuesto, tipo de propiedad, ubicación, dormitorios y comodidades.
        - Escribí en español, claro y breve.
        - Respondé EXCLUSIVAMENTE en JSON válido con esta forma:
        {
          "summary": "texto",
          "highlights": [ { "listing_id": "id", "title": "titulo", "text": "texto" } ],
          "recommended_property_id": "id",
          "recommendation": "texto",
          "disclaimer": "texto"
        }
        El campo recommended_property_id debe ser uno de los listing_id provistos.
        PROMPT;
    }

    private function userPrompt(Collection $listings, SearchPreference $preference, array $fit): string
    {
        $fitById = collect($fit)->keyBy('listing_id');

        $properties = $listings->map(function (Listing $listing) use ($fitById) {
            $property = $listing->property;
            $row = $fitById[$listing->listing_id] ?? null;

            return [
                'listing_id' => $listing->listing_id,
                'title' => $property->title,
                'operation_type' => $listing->operation_type,
                'property_type' => $property->property_type,
                'price' => (float) $listing->price,
                'currency' => $listing->currency,
                'location' => trim(($property->neighborhood?->name ? "{$property->neighborhood->name}, " : '') . ($property->city?->name ?? '')),
                'bedrooms' => $property->bedrooms,
                'bathrooms' => $property->bathrooms,
                'covered_m2' => $property->covered_m2,
                'has_patio' => (bool) $property->has_patio,
                'has_garage' => (bool) $property->has_garage,
                'allows_pets' => (bool) $listing->allows_pets,
                'structured_fit' => $row['cells'] ?? null,
                'match_count' => $row['match_count'] ?? null,
            ];
        })->values()->all();

        $preferences = [
            'operation_type' => $preference->operation_type,
            'property_type' => $preference->property_type,
            'location' => trim(($preference->neighborhood?->name ? "{$preference->neighborhood->name}, " : '') . ($preference->city?->name ?? '')),
            'max_price' => $preference->max_price ? (float) $preference->max_price : null,
            'min_bedrooms' => $preference->min_bedrooms,
            'needs_patio' => (bool) $preference->needs_patio,
            'needs_garage' => (bool) $preference->needs_garage,
            'requires_pets_allowed' => (bool) $preference->requires_pets_allowed,
        ];

        $payload = json_encode([
            'preferences' => $preferences,
            'properties' => $properties,
        ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

        return "Preferencias del usuario y propiedades comparadas (con su ajuste estructurado ya calculado):\n\n{$payload}\n\n"
            . 'Generá la evaluación orientativa en el JSON solicitado, recomendando la propiedad con mejor ajuste a las preferencias.';
    }
}
