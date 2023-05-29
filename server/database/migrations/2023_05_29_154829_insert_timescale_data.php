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
            'escala' => '06:00 as 13:00'
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
