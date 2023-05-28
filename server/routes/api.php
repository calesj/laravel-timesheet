<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ROTAS DO HORARIO DE ESCALA
Route::middleware('auth:sanctum')->controller(\App\Http\Controllers\TimescaleController::class)->prefix('timescale')->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

// ROTAS DO COLABORADOR
Route::middleware('auth:sanctum')->controller(\App\Http\Controllers\CollaboratorController::class)->prefix('collaborator')->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

Route::controller(\App\Http\Controllers\AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::post('/login', 'login');
});


