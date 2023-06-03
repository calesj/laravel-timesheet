<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\Collaborator;
use App\Models\TimeRecord;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Mockery\Exception;

/**
 *
 */
class AuthController extends Controller
{
    /*** @var string[] */
    private $rules = [
        'name' => 'required|string|max:255',
        'email' => 'required|email|string|max:255|unique:users',
        'password' => 'required|string|min:8',
        'matricula' => 'required',
        'cpf' => 'required'
    ];

    /**
     * METODO RESPONSAVEL POR FAZER O REGISTRO DE UM USUARIO
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|true
     */
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
            $user->user_privilege_id = 1;
            $user->save();

            $collaborator = new Collaborator();
            $collaborator->matricula = $request['matricula'];
            $collaborator->cpf = $request['cpf'];
            $collaborator->user_id = $user->id;
            $collaborator->timescale_id = $request['timescale_id'];
            $collaborator->save();

            return response()->json($collaborator);
        } catch (Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR FAZER O LOGIN
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|true
     */
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

            $collaborator = Collaborator::select('id')->where('user_id', $user->id)->first();

            $dataAtual = Carbon::now('America/Sao_Paulo')->format('y-m-d');

            $time_record = TimeRecord::select('id')->where('collaborator_id', $collaborator->id)->where('data', $dataAtual)->first();

            if (!$time_record) {
                $time_record = new TimeRecord();
                $time_record->data = date('Y/m/d');
                $time_record->collaborator_id = $collaborator->id;
                $time_record->save();
            }

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

    /**
     * METODO RESPONSAVEL POR ATUALIZAR DADOS DE UM COLABORADOR, LEMBRANDO QUE UM COLABORADOR E UM USUARIO
     * @param Request $request
     * @param int $userId
     * @return \Illuminate\Http\JsonResponse|true
     */
    public function updateCollaborator(Request $request, int $userId)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'string',
                'max:255',
                Rule::unique('users')->ignore($userId),
            ],
            'matricula' => 'required',
            'cpf' => 'required',
            'timescale_id' => 'required'
        ];
        $validate = FormValidation::validar($request->all(), $rules);

        if ($validate !== true) {
            return $validate;
        }

        try {
            $user = User::find($userId);

            $user->name = $request['name'];
            $user->email = $request['email'];
            $user->save();

            $collaborator = Collaborator::find($user->collaborator->id)->load('user');
            $collaborator->matricula = $request['matricula'];
            $collaborator->cpf = $request['cpf'];
            $collaborator->user_id = $user->id;
            $collaborator->timescale_id = $request['timescale_id'];
            $collaborator->save();

            return response()->json($collaborator);
        } catch (Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR DELETAR USUARIOS
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if(!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        $user = $this->authAdmCheck();

        if ($user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        $userFind = User::find($id);
        if (!$userFind) {
            return response()->json('Recurso nao encontrado', 204);
        }

        try {
            $userFind->delete();
            return response()->json(['message' => 'Item deletado com sucesso']);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * VERIFICA SE O USUARIO AUTENTICADO, TEM PRIVILEGIOS ADMINISTRATIVOS
     * @return mixed
     */
    private function authAdmCheck(){
        return Auth::user()->load('userPrivilege');
    }
}
