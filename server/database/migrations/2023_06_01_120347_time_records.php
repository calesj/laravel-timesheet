<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('time_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('collaborator_id');
            $table->date('data');
            $table->time('entrada')->nullable();
            $table->time('almoco_saida')->nullable();
            $table->time('almoco_retorno')->nullable();
            $table->time('saida')->nullable();
            $table->boolean('ponto_entrada_registrado')->default(false);
            $table->boolean('ponto_almoco_registrado')->default(false);
            $table->boolean('ponto_retorno_almoco_registrado')->default(false);
            $table->boolean('ponto_saida_registrado')->default(false);
            $table->time('saldo_final')->default('00:00:00');
            $table->timestamps();

            $table->foreign('collaborator_id')->references('id')->on('collaborators');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('time_records');
    }
};
