<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Collaborator;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // CRIANDO 10 USUARIOS ALEATORIOS
        $users = \App\Models\User::factory(10)->create();

        // PRA CADA USUARIO, ESTAMOS CADASTRANDO UM COLABORADOR, E RELACINANDO O ID
        $users->each(function ($user) {
           Collaborator::factory()->create(['user_id' => $user->id]);
        });
    }
}
