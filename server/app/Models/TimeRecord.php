<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'collaborator_id',
        'data',
        'entrada',
        'almoco_saida',
        'almoco_retorno',
        'saida',
        'ponto_entrada_registrado',
        'ponto_almoco_registrado',
        'ponto_retorno_almoco_registrado',
        'ponto_saida_registrado',
        'saldo_final',
    ];

    /**
     * CADA REGISTRO DE PONTO SO PODE PERTENCER A UM COLABORADOR
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function collaborator()
    {
        return $this->belongsTo(Collaborator::class);
    }
}
