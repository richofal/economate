<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,

            // Basic user attributes
            'address' => $this->address,
            'phone' => $this->phone,
            'company_name' => $this->company_name,
            'position' => $this->position,
            'profile_photo' => $this->profile_photo,
            'contact_preference' => $this->contact_preference,
            'notes' => $this->notes,

            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
            'last_login_at' => $this->last_login_at,

            'roles' => $this->roles->map->only(['id', 'name', 'guard_name']),
            'permissions' => $this->getAllPermissions()->pluck('name'),
        ];
    }
}
