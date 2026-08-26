<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\BackofficeEntityController;

Route::prefix('api/admin')->middleware('throttle:60,1')->group(function(){
    Route::post('/login',[AdminController::class,'login'])->middleware('throttle:10,1');
    Route::middleware('auth')->group(function(){
        Route::get('/me',[AdminController::class,'me']);
        Route::get('/dashboard',[AdminController::class,'dashboard']);
        Route::post('/logout',[AdminController::class,'logout']);
        Route::get('/entities/{entity}', [BackofficeEntityController::class, 'index']);
        Route::post('/entities/{entity}', [BackofficeEntityController::class, 'store']);
        Route::get('/entities/{entity}/{id}', [BackofficeEntityController::class, 'show'])->whereNumber('id');
        Route::patch('/entities/{entity}/{id}', [BackofficeEntityController::class, 'update'])->whereNumber('id');
        Route::delete('/entities/{entity}/{id}', [BackofficeEntityController::class, 'destroy'])->whereNumber('id');
    });
});

Route::get('/{path?}', function () {
    return redirect()->away(config('app.frontend_url'));
})->where('path', '^(?!api).*$');
