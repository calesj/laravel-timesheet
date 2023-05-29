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
        DB::table('collaborators')->insert([
            'nome' => 'Cales Junes',
            "matricula" => '9992',
            "cpf" => "213123",
            "timescale_id" => "1",
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('collaborators')->where('nome', 'Cales Junes')->delete();
    }
};
