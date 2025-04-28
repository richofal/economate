<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->can('edit-products');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'name' => 'required|string|max:255|unique:products,name',
            'description' => 'nullable|string|max:1000',
            'category_id' => 'required|exists:categories,id',
            'code' => 'required|string|max:50|unique:products,code',
            'setup_fee' => 'required|numeric|min:0',
            'bandwidth' => 'required|integer|min:1',
            'bandwidth_type' => 'required|string|in:mbps,mbps,gbps',
            'connection_type' => 'required|string|max:50',
            'minimum_contract_months' => 'required|integer|min:1',
            'is_recurring' => 'boolean',
            'is_active' => 'boolean',
            'uptime_guarantee' => 'required|numeric|min:0|max:100',
            'is_featured' => 'boolean',
        ];
    }
}
