<?php

use App\Http\Controllers\QuoteRequestController;
use Illuminate\Support\Facades\Route;

Route::get('/status', function () {
    return response()->json([
        'status' => 'online',
        'service' => config('app.name'),
        'framework' => 'Laravel',
    ]);
});

Route::post('/quote-requests', [QuoteRequestController::class, 'store'])
    ->middleware('throttle:5,1');
