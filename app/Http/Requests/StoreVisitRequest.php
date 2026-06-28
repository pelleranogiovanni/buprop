<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVisitRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo usuarios autenticados con rol "interesado" pueden solicitar visitas.
        return $this->user()?->hasRole('tenant') ?? false;
    }

    public function rules(): array
    {
        return [
            'listing_id'          => ['required', 'uuid', 'exists:listings,listing_id'],
            'preferred_date'      => ['required', 'date', 'after_or_equal:today'],
            'preferred_time_slot' => ['required', 'in:morning,afternoon,evening'],
            'preferred_time'      => ['required', 'string', 'max:20'],
            'alternative_date'    => ['nullable', 'date', 'after:preferred_date'],
            'comment'             => ['nullable', 'string', 'max:1000'],
            'contact_phone'       => [Rule::requiredIf(fn () => empty($this->user()->phone)), 'nullable', 'string', 'max:30'],
            'update_phone'        => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'listing_id.required'          => 'La publicación es obligatoria.',
            'listing_id.exists'            => 'La publicación no existe.',
            'preferred_date.required'      => 'La fecha preferida es obligatoria.',
            'preferred_date.after_or_equal' => 'La fecha preferida no puede ser anterior a hoy.',
            'preferred_time_slot.required' => 'Elegí una franja horaria.',
            'preferred_time_slot.in'       => 'La franja horaria no es válida.',
            'preferred_time.required'      => 'Indicá un horario aproximado.',
            'alternative_date.after'       => 'La fecha alternativa debe ser posterior a la fecha preferida.',
            'contact_phone.required'       => 'El teléfono es obligatorio para coordinar la visita.',
        ];
    }
}
