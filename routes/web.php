<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\HomeController;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/propiedad/{listing}', [\App\Http\Controllers\PropertyController::class, 'show'])->name('property.show');
Route::get('/comparador', function() {
    return Inertia::render('Compare');
})->name('compare');

// Auth routes
Route::get('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [\App\Http\Controllers\Auth\RegisterController::class, 'register']);
Route::post('/logout', function() {
    auth()->logout();
    return redirect()->route('home');
})->name('logout');

// Protected routes
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/publicar', [\App\Http\Controllers\PublishController::class, 'create'])->name('publish.create');
    Route::post('/publicar', [\App\Http\Controllers\PublishController::class, 'store'])->name('publish.store');
    Route::patch('/listings/{listing}/moderation', [\App\Http\Controllers\DashboardController::class, 'updateModeration'])->name('listings.moderation');
});



require __DIR__.'/settings.php';
