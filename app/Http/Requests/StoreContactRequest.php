<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Cualquier usuario autenticado puede enviar una consulta.
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'listing_id'         => ['required', 'uuid', 'exists:listings,listing_id'],
            'message'            => ['required', 'string', 'min:10', 'max:1000'],
            'contact_preference' => ['required', 'in:email,phone,whatsapp'],
            'contact_phone'      => ['nullable', 'string', 'max:30'],
            'update_phone'       => ['boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'listing_id.required'         => 'La publicación es obligatoria.',
            'listing_id.exists'           => 'La publicación no existe.',
            'message.required'            => 'El mensaje es obligatorio.',
            'message.min'                 => 'El mensaje debe tener al menos 10 caracteres.',
            'message.max'                 => 'El mensaje no puede superar los 1000 caracteres.',
            'contact_preference.required' => 'Indicá una preferencia de contacto.',
            'contact_preference.in'       => 'La preferencia de contacto no es válida.',
        ];
    }
}
