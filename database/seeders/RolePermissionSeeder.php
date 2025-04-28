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
        $managerRole = Role::create(['name' => 'manager']);
        $salesRole = Role::create(['name' => 'sales']);
        $customerRole = Role::create(['name' => 'customer']);
        $leadRole = Role::create(['name' => 'lead']);

        // Create permissions
        $permissions = [
            // Dashboard
            'view-dashboard',

            // Products
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'offer-products',
            'approve-offer-products',
            'reject-offer-products',

            // Categories
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',

            // Product Prices
            'view-product-prices',
            'create-product-prices',
            'edit-product-prices',
            'delete-product-prices',

            // Subscriptions
            'view-subscriptions',
            'create-subscriptions',
            'edit-subscriptions',
            'delete-subscriptions',
            'approve-subscriptions',
            'reject-subscriptions',

            // Customers
            'view-customers',
            'create-customers',
            'edit-customers',
            'delete-customers',

            // Leads
            'view-leads',
            'create-leads',
            'edit-leads',
            'delete-leads',
            'convert-leads',

            'view-sales',
            'edit-sales',
            'delete-sales',
            'create-sales',

            'view-managers',
            'edit-managers',
            'delete-managers',
            'create-managers',

            // Product Offers
            'view-offers',
            'create-offers',
            'edit-offers',
            'delete-offers',
            'accept-offers',
            'reject-offers',

            // User management
            'view-users',
            'create-users',
            'edit-users',
            'delete-users',

            // Reports
            'view-reports',
            'export-reports',
            'manage-offers'
        ];

        // Create all permissions
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Admin gets all permissions
        $adminRole->givePermissionTo(Permission::all());

        // Manager permissions
        $managerRole->givePermissionTo([
            'view-dashboard',
            'view-products',
            'create-products',
            'edit-products',
            'delete-products',
            'view-categories',
            'create-categories',
            'edit-categories',
            'delete-categories',
            'view-product-prices',
            'create-product-prices',
            'edit-product-prices',
            'delete-product-prices',
            'view-subscriptions',
            'approve-subscriptions',
            'reject-subscriptions',
            'view-sales',
            'edit-sales',
            'delete-sales',
            'create-sales',
            'view-customers',
            'edit-customers',
            'view-leads',
            'edit-leads',
            'convert-leads',
            'view-offers',
            'view-users',
            'create-users',
            'edit-users',
            'view-reports',
            'export-reports',
        ]);

        // Sales permissions
        $salesRole->givePermissionTo([
            'view-dashboard',
            'view-products',
            'offer-products',
            'view-product-prices',
            'view-categories',
            'view-subscriptions',
            'view-users',
            'view-customers',
            'view-leads',
            'view-offers',
            'create-offers',
            'edit-offers',
            'delete-offers',
        ]);

        // Customer permissions
        $customerRole->givePermissionTo([
            'view-products',
            'view-categories',
            'view-product-prices',
            'view-subscriptions',
            'view-offers',
            'manage-offers'

        ]);

        // Lead permissions
        $leadRole->givePermissionTo([
            'view-products',
            'view-categories',
            'view-product-prices',
            'view-offers',
            'manage-offers',
        ]);
    }
}
