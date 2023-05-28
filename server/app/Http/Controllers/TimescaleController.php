<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\Timescale;
use Illuminate\Http\Request;
use Ramsey\Uuid\Type\Time;

class TimescaleController extends Controller
{

    private $rules = [
        'nome' => 'required',
        'escala' => 'required'
    ];
    public function index()
    {
        $timescales = Timescale::all();

        return response()->json($timescales);
    }

    public function show($id)
    {
        $timescale = Timescale::find($id);

        return response()->json($timescale);
    }

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
