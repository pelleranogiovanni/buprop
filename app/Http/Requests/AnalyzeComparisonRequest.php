<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AnalyzeComparisonRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();

        // Solo interesados con preferencias cargadas acceden a la evaluación IA.
        return $user !== null
            && $user->hasRole('tenant')
            && $user->searchPreference()->exists();
    }

    public function rules(): array
    {
        return [
            'listing_ids'   => ['required', 'array', 'min:2', 'max:3'],
            'listing_ids.*' => ['uuid', 'distinct', 'exists:listings,listing_id'],
        ];
    }
}
