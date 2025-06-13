<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $userRole = Role::create(['name' => 'user']);

        // Create permissions
        $permissions = [
            // Dashboard
            'view-dashboard',
        ];

        // Assign permissions to roles
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        $adminRole->givePermissionTo($permissions);
        $userRole->givePermissionTo('view-dashboard');
    }
}
