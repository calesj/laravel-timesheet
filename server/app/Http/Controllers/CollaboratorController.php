<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\Collaborator;
use App\Models\Timescale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 *
 */
class CollaboratorController extends Controller
{
    /**
     * REGRAS DE VALIDACAO
     * @var string[]
     */
    private $rules = [
        'nome' => 'required',
        'matricula' => 'required',
        'cpf' => 'required',
        'timescale_id' => 'required'
    ];

    /**
     * METODO RESPONSAVEL POR RETORNAR TODOS OS REGISTROS DA TABELA Timescale
     * @return JsonResponse
     */
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }
        try {
            $collaborators = Collaborator::with('timescale')->get();

            if (!$collaborators) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            return response()->json($collaborators);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR FAZER UMA BUSCA ATRAVES DO `id`
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id)
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        try {
            $collaborator = Collaborator::find($id);

            if (!$collaborator) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            return response()->json($collaborator);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR FAZER UMA INSERÇÃO NO BANCO
     * @param Request $request
     * @return JsonResponse|true
     */
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        $validate = FormValidation::validar($request->all(), $this->rules);

        if ($validate !== true) {
            return $validate;
        }

        try {
            $collaborator = new Collaborator();
            $collaborator->nome = $request['nome'];
            $collaborator->matricula = $request['matricula'];
            $collaborator->cpf = $request['cpf'];
            $collaborator->timescale_id = $request['timescale_id'];
            $timescale = Timescale::find($request['timescale_id']);

            // VERIFICA SE O ID DO TIMESCALE, EXISTE NA TABELA timescale
            if ($timescale) {
                $collaborator->save();
                return response()->json($collaborator);
            } else {
                $validate = [
                    'errors' => [
                        'timescale_id' => 'Por favor, escolha um horario de escala valido'
                    ]
                ];
                return response()->json('Oba, deu certo!');
            }


        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * METODO RESPONSAVEL POR FAZER ATUALIZACAO DE UM REGISTRO
     * @param $id
     * @param Request $request
     * @return JsonResponse|true
     */
    public function update($id, Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        $validate = FormValidation::validar($request->all(), $this->rules);

        // VERIFICA SE EXISTE ALGUM ERRO DE VALIDACAO, SE EXISTIR ELE RETORNA ESSE ERRO
        if ($validate !== true) {
            return $validate;
        }

        try {
            $collaborator = Collaborator::find($id);

            // CASO NAO EXISTA ESSE USUARIO
            if (!$collaborator) {
                return response()->json('Recurso nao encontrado', 204);
            }

            $collaborator->nome = $request['nome'];
            $collaborator->matricula = $request['matricula'];
            $collaborator->cpf = $request['cpf'];
            $collaborator->timescale_id = $request['timescale_id'];
            $timescale = Timescale::find($request['timescale_id']);

            // VERIFICA SE O ID DO TIMESCALE, EXISTE NA TABELA timescale
            if ($timescale) {
                $collaborator->save();
                return response()->json($collaborator);
            } else {
                $validate = [
                    'errors' => [
                        'timescale_id' => 'Por favor, escolha um horario de escala valido'
                    ]
                ];
                return response()->json($validate);
            }

        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * METODO RESPONSAVEL POR DELETAR O REGISTRO DA TABELA COLLABORATORS
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        $collaborator = Collaborator::find($id);
        if (!$collaborator) {
            return response()->json('Recurso nao encontrado', 204);
        }

        try {
            $collaborator->delete();
            return response()->json(['message' => 'Item deletado com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }
}
