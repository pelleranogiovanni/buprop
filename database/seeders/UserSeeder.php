<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get Villa Ángela city ID
        $villaAngelaCityId = DB::table('cities')->where('name', 'Villa Ángela')->first()->city_id;
        
        // Admin user
        $admin = User::create([
            'name' => 'Admin Sistema',
            'email' => 'admin@buprop.com',
            'password' => Hash::make('password'),
            'phone' => '+54 364 1234-5678',
            'city_id' => $villaAngelaCityId,
            'occupation' => 'Administrador del Sistema',
            'verification_status' => 'verified',
            'is_active' => true,
        ]);
        $admin->assignRole('admin');

        // Owner user
        $owner = User::create([
            'name' => 'María Propietaria',
            'email' => 'maria@example.com',
            'password' => Hash::make('password'),
            'phone' => '+54 364 2345-6789',
            'city_id' => $villaAngelaCityId,
            'birth_date' => '1980-05-15',
            'occupation' => 'Contadora',
            'bio' => 'Propietaria de varios inmuebles en Villa Ángela.',
            'verification_status' => 'verified',
            'is_active' => true,
        ]);
        $owner->assignRole('owner');

        // Agency user
        $agency = User::create([
            'name' => 'Carlos Inmobiliaria',
            'email' => 'carlos@inmobiliaria.com',
            'password' => Hash::make('password'),
            'phone' => '+54 364 3456-7890',
            'city_id' => $villaAngelaCityId,
            'birth_date' => '1975-08-22',
            'occupation' => 'Corredor Inmobiliario',
            'business_name' => 'Inmobiliaria Villa Ángela',
            'tax_id' => '20-12345678-9',
            'license_number' => 'CPI-VA-001',
            'verification_status' => 'verified',
            'is_active' => true,
        ]);
        $agency->assignRole('agency');

        // Tenant users (varios inquilinos)
        $tenants = [
            [
                'name' => 'Juan Inquilino',
                'email' => 'juan@example.com',
                'occupation' => 'Desarrollador de Software',
                'birth_date' => '1990-03-10',
            ],
            [
                'name' => 'Ana Buscadora',
                'email' => 'ana@example.com',
                'occupation' => 'Profesora',
                'birth_date' => '1985-11-28',
            ],
            [
                'name' => 'Luis Estudiante',
                'email' => 'luis@example.com',
                'occupation' => 'Estudiante Universitario',
                'birth_date' => '1998-07-03',
            ],
        ];

        foreach ($tenants as $tenantData) {
            $tenant = User::create([
                'name' => $tenantData['name'],
                'email' => $tenantData['email'],
                'password' => Hash::make('password'),
                'phone' => '+54 364 ' . fake()->numerify('####-####'),
                'city_id' => $villaAngelaCityId,
                'birth_date' => $tenantData['birth_date'],
                'occupation' => $tenantData['occupation'],
                'bio' => 'Buscando alquilar en Villa Ángela.',
                'is_active' => true,
            ]);
            $tenant->assignRole('tenant');
        }
    }
}