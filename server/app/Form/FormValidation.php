<?php

namespace App\Form;
use Illuminate\Support\Facades\Validator;

Class FormValidation
{
    static function validar(array $data, array $rules)
    {
        $message = [
            'required' => 'O campo :attribute é obrigatório',
            'email' => 'O formato do email esta invalido',
            'min' => 'sao necessarios pelomenos 8 caracteres',
            'unique' => 'email ja existe'
        ];
        // FAZENDO AS VALIDACOES
        $validator = Validator::make($data, $rules, $message);

        // CASO HAJA ALGUM ERRO, RETORNARA TODOS ELES DENTRO DO INDICE 'errors'
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        return true;
    }
}
