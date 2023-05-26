<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Timescale extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'escala'
    ];

    // UMA ESCALA, PODE TER VARIOS COLABORADORES
    public function collaborators(): HasMany
    {
        return $this->hasMany(Collaborator::class);
    }
}
