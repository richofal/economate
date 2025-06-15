<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->transaction);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_wallet_id' => [
                'required',
                'exists:user_wallets,id',
            ],
            'type' => ['required', Rule::in(['debit', 'credit'])],
            'amount' => ['required', 'numeric', 'min:1'],
            'description' => ['nullable', 'string', 'max:255'],
            'date' => ['required', 'date', 'before_or_equal:today'],
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
            'user_wallet_id.required' => 'Silakan pilih dompet yang akan digunakan untuk transaksi ini.',
            'type.required' => 'Silakan pilih jenis transaksi (debit/credit).',
            'amount.required' => 'Silakan masukkan jumlah transaksi.',
            'amount.min' => 'Jumlah transaksi harus lebih besar dari 0.',
            'description.max' => 'Deskripsi tidak boleh lebih dari 255 karakter.',
            'date.required' => 'Silakan masukkan tanggal transaksi.',
            'date.before_or_equal' => 'Tanggal transaksi tidak boleh lebih dari hari ini.',
        ];
    }
}
