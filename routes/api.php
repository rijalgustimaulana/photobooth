<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\SessionController;
use App\Http\Controllers\Api\PhotoboothPhotoController;
use App\Http\Controllers\Api\PhotoboothSessionResultController;
use App\Http\Controllers\Api\PhotoboothResultController;
use App\Http\Controllers\PhotoboothController;
use App\Http\Controllers\Api\PhotoboothDashboardController;
Route::get('/test', function () {
    return response()->json(['message' => 'API works']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/sessions', [SessionController::class, 'store']);
    Route::post('/sessions/{session}/photos', [PhotoboothPhotoController::class, 'store']);
    Route::get('/photobooth-sessions/{id}/result', [PhotoboothSessionResultController::class, 'show']);
    Route::get('/my-photobooth-strips', [PhotoboothDashboardController::class, 'index']);
    Route::delete('/photobooth-sessions/{id}', [PhotoboothResultController::class, 'destroy']);
});

Route::post('/photobooth/upload', [PhotoboothController::class, 'upload']);
Route::get('/photobooth-sessions/{id}/strip', [PhotoboothResultController::class, 'strip']);
Route::get('/photobooth-sessions/{id}/strip/download', [\App\Http\Controllers\Api\PhotoboothResultController::class, 'download']);