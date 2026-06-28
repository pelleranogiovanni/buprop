<?php

namespace App\Services;

use App\Models\ContactRequest;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class ContactRequestService
{
    public function create(array $data, User $user): ContactRequest
    {
        $listing = Listing::where('listing_id', $data['listing_id'])
            ->available()
            ->firstOrFail();

        if (! $listing->allow_messages) {
            throw ValidationException::withMessages([
                'message' => 'Esta publicación no acepta consultas en este momento.',
            ]);
        }

        if ($listing->publisher_id === $user->id) {
            throw ValidationException::withMessages([
                'message' => 'No podés enviarte una consulta a tu propia publicación.',
            ]);
        }

        // Actualizar el teléfono de la cuenta si el interesado lo solicitó.
        if (! empty($data['update_phone']) && ! empty($data['contact_phone'])) {
            $user->update(['phone' => $data['contact_phone']]);
        }

        $contactRequest = ContactRequest::create([
            'listing_id'         => $listing->listing_id,
            'requester_id'       => $user->id,
            'message'            => $data['message'],
            'contact_preference' => $data['contact_preference'],
            'contact_phone'      => $data['contact_phone'] ?? null,
            'status'             => 'sent',
        ]);

        // TODO: event(new ContactRequestCreated($contactRequest)) para notificar al responsable.

        return $contactRequest;
    }
}
