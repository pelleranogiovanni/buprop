<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PropertyController;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Properties
Route::get('/properties', [PropertyController::class, 'index'])->name('properties.index');
Route::get('/properties/{listing}', [PropertyController::class, 'show'])->name('properties.show');

// Backward-compat redirect for old Spanish URL
Route::redirect('/propiedad/{listing}', '/properties/{listing}', 301);

Route::get('/comparador', fn () => Inertia::render('Compare'))->name('compare');

// Auth routes
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'register']);
Route::post('/logout', function () {
    Auth::logout();
    return redirect()->route('home');
})->name('logout');

// Protected routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/publicar', [\App\Http\Controllers\PublishController::class, 'create'])->name('publish.create');
    Route::post('/publicar', [\App\Http\Controllers\PublishController::class, 'store'])->name('publish.store');
    Route::patch('/listings/{listing}/moderation', [\App\Http\Controllers\DashboardController::class, 'updateModeration'])->name('listings.moderation');
});

// Onboarding routes
Route::get('/registrarse', fn () => Inertia::render('Onboarding/Register'))->name('onboarding.register');

Route::middleware('auth')->group(function () {
    Route::get('/preferencias', [\App\Http\Controllers\Onboarding\PreferencesController::class, 'show'])->name('onboarding.preferences');
    Route::post('/preferencias', [\App\Http\Controllers\Onboarding\PreferencesController::class, 'store'])->name('onboarding.preferences.store');
});

require __DIR__.'/settings.php';
