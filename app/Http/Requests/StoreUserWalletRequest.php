<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreUserWalletRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        return $user->hasPermissionTo('create-user-wallets');
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
            'wallet_id' => [
                'required_without:new_wallet_name',
                Rule::when($this->wallet_id !== 'new', ['exists:wallets,id']),
                function ($attribute, $value, $fail) {
                    if ($value === '0') {
                        $fail('Silakan pilih jenis dompet atau buat dompet baru.');
                    }
                },
            ],
            'new_wallet_name' => [
                'required_if:wallet_id,new',
                'nullable',
                'string',
                'min:2',
                'max:255',
                'unique:wallets,name',
                'regex:/^[a-zA-Z0-9\s\-_.]+$/',
            ],
            'balance' => 'required|numeric|min:0',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'wallet_id.required_without' => 'Silakan pilih jenis dompet atau buat dompet baru.',
            'wallet_id.exists' => 'Jenis dompet yang dipilih tidak valid.',

            'new_wallet_name.required_if' => 'Nama dompet baru wajib diisi.',
            'new_wallet_name.min' => 'Nama dompet baru minimal :min karakter.',
            'new_wallet_name.max' => 'Nama dompet baru maksimal :max karakter.',
            'new_wallet_name.unique' => 'Nama dompet ini sudah digunakan.',
            'new_wallet_name.regex' => 'Nama dompet hanya boleh berisi huruf, angka, spasi, dan tanda - _ .',

            'balance.required' => 'Saldo awal wajib diisi.',
            'balance.numeric' => 'Saldo awal harus berupa angka.',
            'balance.min' => 'Saldo awal tidak boleh kurang dari :min.',
            'balance.max' => 'Saldo awal tidak boleh lebih dari :max.',

            'notes.max' => 'Catatan maksimal :max karakter.',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('balance')) {
            $this->merge([
                'balance' => str_replace([',', '.', 'Rp', ' '], '', $this->balance),
            ]);
        }
    }
}
