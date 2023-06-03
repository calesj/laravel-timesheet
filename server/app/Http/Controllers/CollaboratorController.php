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
            $collaborators = Collaborator::with(['timescale', 'user'])->get();

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

    public function search(string $busca)
    {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }

        try {
            $collaborators = Collaborator::with(['user', 'timescale'])
                ->whereHas('user', function ($query) use ($busca) {
                    $query->where('name', 'LIKE', '%' . $busca . '%');
                })
                ->orWhere('matricula', 'LIKE', '%' . $busca . '%')
                ->orWhere('cpf', 'LIKE', '%' . $busca . '%')
                ->get();

            if ($collaborators->isEmpty()) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            return response()->json($collaborators);
        } catch (\Exception $exception) {
            return response()->json($exception);
        }
    }
}
