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
        $models = [
            'wallets',
            'users',
            'user-wallets',
            'transactions',
            'split-bills',
            'budget-plans'
        ];

        $allPermissions = [];
        foreach ($models as $model) {
            $permissionNames = [
                'view-any-' . $model,
                'view-' . $model,
                'create-' . $model,
                'update-' . $model,
                'delete-' . $model
            ];

            $permissionNames[] = 'view-dashboard';

            foreach ($permissionNames as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName]);
                $allPermissions[] = $permissionName;
            }
        }

        $userPermissions = [
            'view-dashboard',
            'view-any-user-wallets',
            'create-user-wallets',
            'update-user-wallets',
            'delete-user-wallets',
            'view-user-wallets',
            'view-any-transactions',
            'view-transactions',
            'create-transactions',
            'update-transactions',
            'delete-transactions',
            'view-any-split-bills',
            'view-split-bills',
            'create-split-bills',
            'update-split-bills',
            'delete-split-bills',
            'view-any-budget-plans',
            'view-budget-plans',
            'create-budget-plans',
            'update-budget-plans',
            'delete-budget-plans'
        ];

        $adminRole->givePermissionTo($allPermissions);
        $userRole->givePermissionTo($userPermissions);
    }
}
