<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 *
 */
class Collaborator extends Model
{
    use HasFactory;

    /**
     * CAMPOS PREENCHIVEIS
     * @var string[]
     */
    protected $fillable = [
        'nome',
        'matricula',
        'cpf',
        'timescale_id'
    ];

    /**
     * UM COLABORADOR, SO PODE PERTENCER A UMA ESCALA
     * @return BelongsTo
     */
    public function timescale(): BelongsTo
    {
        return $this->belongsTo(Timescale::class);
    }

    /**
     * UM COLABORADOR, É UM USUARIO
     * @return BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * UM COLABORADOR, PODE TER VARIOS REGISTROS DE PONTO
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function timeRecords()
    {
        return $this->hasMany(TimeRecord::class);
    }
}
