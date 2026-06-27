<?php

namespace App\Http\Controllers;

use App\Services\ListingService;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly ListingService $listingService
    ) {}

    public function index(): Response
    {
        return Inertia::render('Home', [
            'featuredListings' => $this->listingService->getFeatured(3),
            'auth' => [
                'user' => auth()->check() ? auth()->user()->load('roles') : null,
            ],
        ]);
    }
}
