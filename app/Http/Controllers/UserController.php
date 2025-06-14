<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('view-any-users')) {
            return redirect()->route('dashboard')
                ->with('error', 'You do not have permission to view users.');
        }

        // Get users with roles
        $users = User::with('roles:name')
            ->orderBy('name')
            ->get()
            ->map(function ($user) {
                // Map roles to just array of names for frontend
                $user->roles = $user->roles->pluck('name')->toArray();
                return $user;
            });

        return Inertia::render('Dashboard/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
        /** @var \App\Models\User $user */
        $user = Auth::user();
        if (!$user->hasPermissionTo('create-users')) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to create users.');
        }
        $roles = Role::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Dashboard/Users/Create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
        $validatedData = $request->validated();
        try {
            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'address' => $validatedData['address'],
                'birth_date' => $validatedData['birth_date'],
                'gender' => $validatedData['gender'],
                'password' => Hash::make($validatedData['password']),
                'status' => $validatedData['status'],
            ]);
            if (!empty($validated['roles'])) {
                $user->assignRole($validatedData['roles']);
            }

            return redirect()->route('users.index')
                ->with('success', 'User created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to create user: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->hasPermissionTo('view-users')) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to view users.');
        }
        $user->load(['roles', 'userWallets.wallet']);
        $permissions = $user->getAllPermissions()->pluck('name')->toArray();

        return Inertia::render('Dashboard/Users/Show', [
            'user' => array_merge($user->toArray(), ['permissions' => $permissions]),
            'roles' => $user->roles->pluck('name')->toArray(),
            'wallets' => $user->userWallets,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->hasPermissionTo('update-users')) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to edit users.');
        }

        $roles = Role::orderBy('name')->get(['id', 'name']);
        return Inertia::render('Dashboard/Users/Edit', [
            'user' => $user->load('roles'),
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        //
        $validatedData = $request->validated();
        try {
            $user->update([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'phone' => $validatedData['phone'],
                'address' => $validatedData['address'],
                'birth_date' => $validatedData['birth_date'],
                'gender' => $validatedData['gender'],
            ]);
            if (isset($validatedData['isChangePassword']) && $validatedData['isChangePassword']) {
                $user->password = Hash::make($validatedData['password']);
            }
            $user->status = $validatedData['status'];
            $user->save();
            if (isset($validatedData['roles']) && !empty($validatedData['roles'])) {
                $user->syncRoles($validatedData['roles']);
            } else {
                $user->syncRoles([]);
            }
            return redirect()->route('users.index')
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update user: ' . $e->getMessage(), [
                'user_id' => $user->id,
                'data' => $validatedData,
            ]);
            return redirect()->back()
                ->with('error', 'Failed to update user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        /** @var \App\Models\User $authUser */
        $authUser = Auth::user();
        if (!$authUser->hasPermissionTo('delete-users')) {
            return redirect()->route('users.index')
                ->with('error', 'You do not have permission to delete users.');
        }
        try {
            // Prevent deletion of the currently authenticated user
            if ($authUser->id === $user->id) {
                return redirect()->back()
                    ->with('error', 'You cannot delete your own account.');
            }

            $user->delete();
            return redirect()->route('users.index')
                ->with('success', 'User deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Failed to delete user: ' . $e->getMessage());
        }
    }
}
