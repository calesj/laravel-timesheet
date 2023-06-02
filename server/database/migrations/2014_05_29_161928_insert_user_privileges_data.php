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
        DB::table('user_privileges')->insert([
            'id' => 1,
            'description' => 'collaborator',
        ]);

        DB::table('user_privileges')->insert([
            'id' => 2,
            'description' => 'admin',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('user_privileges')->where('id', 1)->delete();
        DB::table('user_privileges')->where('id', 2)->delete();
    }
};
