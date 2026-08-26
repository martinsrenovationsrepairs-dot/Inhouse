<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuoteRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class QuoteRequestController extends Controller
{
    public function store(StoreQuoteRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $attachments = [];

        foreach ($request->file('attachments', []) as $file) {
            $attachments[] = [
                'name' => $file->getClientOriginalName(),
                'path' => $file->storeAs(
                    'quote-requests/'.now()->format('Y/m'),
                    Str::uuid().'.'.$file->extension(),
                ),
                'mime' => $file->getMimeType(),
                'size' => $file->getSize(),
            ];
        }

        $quoteRequest = QuoteRequest::create([
            ...Arr::except($validated, ['attachments', 'consent']),
            'attachments' => $attachments,
            'consent_at' => now(),
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Quote request received.',
            'reference' => $quoteRequest->id,
        ], 201);
    }
}
