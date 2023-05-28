<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\Timescale;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimescaleController extends Controller
{

    /**
     * @var string[]
     */
    private $rules = [
        'nome' => 'required',
        'escala' => 'required'
    ];

    /**
     * METODO RESPONSAVEL POR RETORNAR TODOS OS REGISTROS DA TABELA Timescale
     * @return JsonResponse
     */
    public function index()
    {
        $timescales = Timescale::all();

        return response()->json($timescales);
    }

    /**
     * METODO RESPONSAVEL POR FAZER UMA BUSCA ATRAVES DO `id`
     * @param $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $timescale = Timescale::find($id);

        return response()->json($timescale);
    }

    /**
     * METODO RESPONSAVEL POR FAZER UMA INSERÇÃO NO BANCO
     * @param Request $request
     * @return JsonResponse|bool
     */
    public function store(Request $request)
    {
        $validation = FormValidation::validar($request->all(), $this->rules);

        if ($validation !== true) {
            return $validation;
        }

        try {
            $timescale = new Timescale();
            $timescale->nome = $request['nome'];
            $timescale->escala = $request['escala'];
            $timescale->save();

            return response()->json($timescale);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * MÉTODO RESPONSAVEL POR FAZER UMA ATUALIZAÇÃO NO BANCO
     * @param $id
     * @param Request $request
     * @return JsonResponse|bool
     */
    public function update($id, Request $request)
    {

        $validation = FormValidation::validar($request->all(), $this->rules);

        if ($validation !== true) {
            return $validation;
        }

        try {
            $timescale = Timescale::find($id);
            $timescale->nome = $request['nome'];
            $timescale->escala = $request['escala'];
            $timescale->save();

            return response()->json($timescale);
        } catch (\Exception $e) {
            return response()->json($e);
        }
    }

    /**
     * MÉTODO RESPONSAVEL POR EXCLUIR UM REGISTRO DO BANCO
     * @param $id
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $timescale = Timescale::find($id);
        if(!$timescale) {
            return response()->json('Recurso nao encontrado');
        }

        try {
            $timescale->delete();
            return response()->json(['message' => 'Item deletado com sucesso']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }

    }
}
