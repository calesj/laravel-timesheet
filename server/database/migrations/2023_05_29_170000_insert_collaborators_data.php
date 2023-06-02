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
            "matricula" => '9992',
            "cpf" => "213123",
            "timescale_id" => "1",
            'user_id' => 1
            ]);

        DB::table('collaborators')->insert([
            "matricula" => '1000',
            "cpf" => "44455",
            "timescale_id" => "1",
            'user_id' => 2
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('collaborators')->where('user_id', '1')->delete();
    }
};
