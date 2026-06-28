<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVisitRequest;
use App\Services\VisitRequestService;
use Illuminate\Http\RedirectResponse;

class VisitRequestController extends Controller
{
    public function __construct(
        private readonly VisitRequestService $visitRequestService
    ) {}

    public function store(StoreVisitRequest $request): RedirectResponse
    {
        $this->visitRequestService->create(
            $request->validated(),
            $request->user()
        );

        return back()->with('success', 'Solicitud de visita enviada correctamente.');
    }
}
