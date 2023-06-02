<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPrivilege extends Model
{

    use HasFactory;
    protected $fillable = [
        'description'
    ];

    /**
     * VARIOS USUARIOS PODEM TER O MESMO PRIVILEGIO
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
