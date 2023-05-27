<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mockery\Exception;

class AuthController extends Controller
{
    private $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|string|max:255|unique:users',
        'password' => 'required|string|min:8'
    ];

    public function register(Request $request)
    {
        // VALIDANDO OS DADOS
        $validate = FormValidation::validar($request->all(), $this->rules);

        if ($validate !== true) {
            return $validate;
        }

        try {
            $user = new User();
            $user->name = $request['name'];
            $user->email = $request['email'];
            $user->password = bcrypt($request['password']);
            $user->save();

            // CRIANDO TOKEN DE ACESSO DO USUARIO, VALIDO POR 30 MINUTOS
            $accessToken = $user->createToken('access_token', [''], now()->addMinute(30))->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $accessToken
            ]);
        } catch (Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    public function login(Request $request)
    {
        $rules = [
            'email' => 'required|email|string|max:255',
            'password' => 'required|string'
        ];

        $validate = FormValidation::validar($request->all(), $rules);

        if($validate !== true) {
            return $validate;
        }

        // PEGA SOMENTE O REGISTRO EMAIL E PASSWORD, DO REQUEST
        $credentials = $request->only('email', 'password');

        // VERIFICA SE EXISTE UM USUARIO COM OS DADOS FORNECIDOS NO BANCO
        if(Auth::attempt($credentials)) {
            // PEGANDO AS INFORMACOES DO USUARIO
            $user = $request->user();

            // CRIA UM TOKEN DE AUTENTICA;AO VALIDO POR 30 MINUTOS
            $token = $user->createToken('access_token', [''], now()->addMinute(30))->plainTextToken;

            return response()->json([
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ]);
        }

        return response()->json([
            'errors' => ['login' => 'Usuarios ou senha invalidos']
        ]);
    }
}
