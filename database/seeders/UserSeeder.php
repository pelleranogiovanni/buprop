<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $villaAngelaCityId = DB::table('cities')->where('name', 'Villa Ángela')->first()->city_id;

        // Admin
        $admin = User::create([
            'name' => 'Admin Usuario',
            'email' => 'admin@mialquiler.com',
            'password' => Hash::make('password'),
            'phone' => '+54 362 123-4567',
            'city_id' => $villaAngelaCityId,
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('admin');

        // Owner
        $owner = User::create([
            'name' => 'Juan Propietario',
            'email' => 'owner@mialquiler.com',
            'password' => Hash::make('password'),
            'phone' => '+54 362 234-5678',
            'city_id' => $villaAngelaCityId,
            'occupation' => 'Ingeniero',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $owner->assignRole('owner');

        // Agency
        $agency = User::create([
            'name' => 'Inmobiliaria Chaco',
            'email' => 'agency@mialquiler.com',
            'password' => Hash::make('password'),
            'phone' => '+54 362 345-6789',
            'city_id' => $villaAngelaCityId,
            'occupation' => 'Inmobiliaria',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $agency->assignRole('agency');

        // Tenant
        $tenant = User::create([
            'name' => 'María Inquilina',
            'email' => 'tenant@mialquiler.com',
            'password' => Hash::make('password'),
            'phone' => '+54 362 456-7890',
            'city_id' => $villaAngelaCityId,
            'occupation' => 'Docente',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $tenant->assignRole('tenant');
    }
}