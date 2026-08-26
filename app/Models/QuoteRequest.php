<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    protected $fillable = [
        'name', 'phone', 'email', 'location', 'service', 'description',
        'preferred_language', 'contact_method', 'preferred_date',
        'attachments', 'consent_at', 'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'attachments' => 'array',
            'preferred_date' => 'date',
            'consent_at' => 'datetime',
        ];
    }
}
