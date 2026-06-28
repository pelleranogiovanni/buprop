<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\User;
use App\Models\VisitRequest;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class VisitRequestService
{
    public function create(array $data, User $user): VisitRequest
    {
        $listing = Listing::where('listing_id', $data['listing_id'])
            ->available()
            ->firstOrFail();

        if ($listing->publisher_id === $user->id) {
            throw ValidationException::withMessages([
                'preferred_date' => 'No podés solicitar una visita a tu propia publicación.',
            ]);
        }

        $contactPhone = $data['contact_phone'] ?? $user->phone;

        // Actualizar el teléfono de la cuenta si el interesado lo solicitó.
        if (! empty($data['update_phone']) && ! empty($data['contact_phone'])) {
            $user->update(['phone' => $data['contact_phone']]);
        }

        // El estado inicial es "requested": la visita NO se confirma automáticamente.
        $visitRequest = VisitRequest::create([
            'listing_id'          => $listing->listing_id,
            'requester_id'        => $user->id,
            'preferred_date'      => $data['preferred_date'],
            'preferred_time_slot' => $data['preferred_time_slot'],
            'preferred_time'      => $data['preferred_time'] ?? null,
            'alternative_date'    => $data['alternative_date'] ?? null,
            'comment'             => $data['comment'] ?? null,
            'contact_phone'       => $contactPhone,
            'status'              => 'requested',
        ]);

        // TODO: event(new VisitRequested($visitRequest)) para notificar al responsable.

        return $visitRequest;
    }

    /**
     * Solicitudes de visita enviadas por el interesado autenticado.
     */
    public function getSentFor(User $user): Collection
    {
        return VisitRequest::with(['listing.property.city', 'listing.property.neighborhood', 'listing.publisher'])
            ->where('requester_id', $user->id)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (VisitRequest $visit) => $this->formatForRequester($visit))
            ->values();
    }

    /**
     * Solicitudes de visita recibidas en las publicaciones del propietario/inmobiliaria.
     */
    public function getReceivedFor(User $user): Collection
    {
        return VisitRequest::with(['listing.property', 'requester'])
            ->whereHas('listing', fn ($query) => $query->where('publisher_id', $user->id))
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (VisitRequest $visit) => $this->formatForPublisher($visit))
            ->values();
    }

    private function formatForRequester(VisitRequest $visit): array
    {
        $property = $visit->listing->property;

        return [
            'visit_id'            => $visit->visit_id,
            'property_title'      => $property->title,
            'property_type'       => $property->property_type,
            'location'            => $property->neighborhood?->name ?? $property->city?->name,
            'publisher_name'      => $visit->listing->publisher->name,
            'preferred_date'      => $visit->preferred_date?->toDateString(),
            'preferred_time_slot' => $visit->preferred_time_slot,
            'status'              => $visit->status,
        ];
    }

    private function formatForPublisher(VisitRequest $visit): array
    {
        return [
            'visit_id'            => $visit->visit_id,
            'property_title'      => $visit->listing->property->title,
            'requester_name'      => $visit->requester->name,
            'preferred_date'      => $visit->preferred_date?->toDateString(),
            'preferred_time_slot' => $visit->preferred_time_slot,
            'preferred_time'      => $visit->preferred_time,
            'comment'             => $visit->comment,
            'contact_phone'       => $visit->contact_phone,
            'status'              => $visit->status,
        ];
    }
}
