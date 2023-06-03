<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 *
 */
class Timescale extends Model
{
    use HasFactory;

    /**
     * CAMPOS PREENCHIVEIS
     * @var string[]
     */
    protected $fillable = [
        'nome',
        'entrada',
        'saida'
    ];

    /**
     * UMA ESCALA, PODE TER VARIOS COLABORADORES
     * @return HasMany
     */
    public function collaborators(): HasMany
    {
        return $this->hasMany(Collaborator::class);
    }
}
