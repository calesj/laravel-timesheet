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
        DB::table('users')->insert([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt('admin'),
            'user_privilege_id' => 2
        ]);

        DB::table('users')->insert([
            'name' => 'teste',
            'email' => 'teste@teste.com',
            'password' => bcrypt('12345678'),
            'user_privilege_id' => 1
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('users')->where('email', 'admin@admin.com')->delete();
        DB::table('users')->where('email', 'teste@teste.com')->delete();
    }
};
