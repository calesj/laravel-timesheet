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

// ROTA QUE RETORNA DADOS DO USUARIO
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();

    // RETORNANDO OS DADOS DO USUARIO, E O REGISTRO DE PONTO, DA DATA EM QUESTAO
    $user->load(['collaborator.timeRecords' => function ($query) {
        $query->where('data', date('Y/m/d'));
    }]);

    return $user;
});

// ROTA PRA VERIFICAR SE O USUARIO TEM PRIVILEGIOS ADMINISTRADOR
Route::middleware(['auth:sanctum', 'admin'])->get('/admin', function (Request $request) {
    $user = $request->user();
    $user->load('userPrivilege');

    return $user;
});

// CASO AS ROTAS NAO PASSEM PELO MIDDLEWARE, CAIRA AUTOMATICAMENTE NESSA ROTA
Route::get('/401', function () {
    return response()->json('Unauthorized', 401);
})->name('login');

// ROTAS DO HORARIO DE ESCALA
Route::middleware(['auth:sanctum', 'admin'])->controller(\App\Http\Controllers\TimescaleController::class)->prefix('timescale')->group(function () {
    Route::get('/', 'index');
    Route::get('/{id}', 'show');
    Route::post('/', 'store');
    Route::put('/{id}', 'update');
    Route::delete('/{id}', 'destroy');
});

// ROTAS DO COLABORADOR
Route::middleware('auth:sanctum')->controller(\App\Http\Controllers\CollaboratorController::class)->prefix('collaborator')->group(function () {
    Route::get('/', 'index');
    Route::get('search/{busca}', 'search');
    Route::get('/{id}', 'show');
});

// ROTAS DO REGISTRO DE PONTO
Route::middleware('auth:sanctum')->controller(\App\Http\Controllers\TimeRecordController::class)->prefix('time_record')->group(function () {
    Route::get('/', 'index');
    Route::get('/{collaboratorId}', 'show');
    Route::put('entry/{collaboratorId}', 'entry');
    Route::put('lunch/{collaboratorId}', 'lunch');
    Route::put('return_lunch/{userId}', 'returnFromLunch');
    Route::put('exit/{collaboratorId}', 'exit');

    Route::put('update/{collaboratorId}', 'updateTimeRecords');


});

Route::controller(\App\Http\Controllers\AuthController::class)->group(function () {
    Route::post('/login', 'login');
});

// ROTAS DO USUARIO ADMINISTRADOR
Route::middleware(['auth:sanctum', 'admin'])->controller(\App\Http\Controllers\AuthController::class)->group(function () {
    Route::post('/register', 'register');
    Route::put('/update/{collaboratorId}', 'updateCollaborator');
    Route::delete('/delete/{userId}', 'destroy');
});


