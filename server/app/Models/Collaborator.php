<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Collaborator extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'matricula',
        'cpf',
        'timescale_id'
    ];

    // UM COLABORADOR, SO PODE TER UMA ESCALA
    public function timescale(): BelongsTo
    {
        return $this->belongsTo(Timescale::class);
    }
}
