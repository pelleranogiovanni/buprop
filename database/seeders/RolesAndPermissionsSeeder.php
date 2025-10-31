<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Crear permisos genéricos
        $permissions = [
            'view_properties',
            'create_properties',
            'edit_properties',
            'delete_properties',
            'view_listings',
            'create_listings',
            'edit_listings',
            'delete_listings',
            'moderate_listings',
            'view_users',
            'edit_users',
            'delete_users',
            'view_contacts',
            'create_contacts',
            'view_visits',
            'create_visits',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Crear roles según las reglas
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $ownerRole = Role::firstOrCreate(['name' => 'owner']);
        $agencyRole = Role::firstOrCreate(['name' => 'agency']);
        $tenantRole = Role::firstOrCreate(['name' => 'tenant']);

        // Asignar permisos a roles
        $adminRole->syncPermissions($permissions);
        
        $ownerRole->syncPermissions([
            'view_properties',
            'create_properties',
            'edit_properties',
            'delete_properties',
            'view_listings',
            'create_listings',
            'edit_listings',
            'delete_listings',
            'view_contacts',
            'view_visits',
        ]);

        $agencyRole->syncPermissions([
            'view_properties',
            'create_properties',
            'edit_properties',
            'view_listings',
            'create_listings',
            'edit_listings',
            'view_contacts',
            'view_visits',
        ]);

        $tenantRole->syncPermissions([
            'view_properties',
            'view_listings',
            'create_contacts',
            'create_visits',
        ]);
    }
}