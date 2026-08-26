<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:120'],
            'phone' => ['required', 'string', 'max:40'],
            'email' => ['required', 'email:rfc', 'max:160'],
            'location' => ['required', 'string', 'max:180'],
            'service' => ['required', Rule::in(['drywall', 'bathroom', 'painting', 'flooring', 'ikea', 'electrical', 'garden'])],
            'description' => ['required', 'string', 'min:10', 'max:2000'],
            'preferred_language' => ['required', Rule::in(['pt', 'en', 'de'])],
            'contact_method' => ['required', Rule::in(['phone', 'whatsapp', 'email'])],
            'preferred_date' => ['nullable', 'date', 'after_or_equal:today'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:10240'],
            'consent' => ['accepted'],
        ];
    }
}
