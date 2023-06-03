<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('timescales')->insert([
            'nome' => 'Escala da Manha',
            'entrada' => '09:00:00',
            'saida' => '18:00:00'
            ]);

        DB::table('timescales')->insert([
            'nome' => 'Escala da Tarde',
            'entrada' => '13:00:00',
            'saida' => '21:00:00'
        ]);

        DB::table('timescales')->insert([
            'nome' => 'Escala da Noite',
            'entrada' => '20:00:00',
            'saida' => '03:00:00'
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('timescales')->where('nome', 'Escala da Manha')->delete();
    }
};
