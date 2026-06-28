<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Services\ContactRequestService;
use Illuminate\Http\RedirectResponse;

class ContactRequestController extends Controller
{
    public function __construct(
        private readonly ContactRequestService $contactRequestService
    ) {}

    public function store(StoreContactRequest $request): RedirectResponse
    {
        $this->contactRequestService->create(
            $request->validated(),
            $request->user()
        );

        return back()->with('success', 'Consulta enviada correctamente.');
    }
}
