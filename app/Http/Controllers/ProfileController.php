<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function index(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->load('roles:name');
        $userData = $user->toArray();
        $userData['roles'] = $user->roles->pluck('name')->all();
        return Inertia::render('Dashboard/Profile/Index', [
            'user' => $userData,
        ]);
    }
    /**
     * Display the user's edit profile form.
     */
    public function edit(): Response
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return Inertia::render('Dashboard/Profile/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->validated());
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        if ($request->boolean('_remove_image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $user->image = null;
        }

        if ($request->hasFile('image')) {
            if ($user->image) {
                Storage::disk('public')->delete($user->image);
            }
            $user->image = $request->file('image')->store('profile-photos', 'public');
        }
        $user->save();
        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }
}
