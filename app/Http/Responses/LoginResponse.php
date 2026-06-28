<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return response()->json(['two_factor' => false]);
        }

        $user = auth()->user();

        if ($user->hasRole('tenant')) {
            if (! $user->searchPreference()->exists()) {
                return redirect()->route('onboarding.preferences');
            }

            return redirect()->intended(route('properties.index'));
        }

        return redirect()->intended(config('fortify.home', '/'));
    }
}
