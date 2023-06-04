<?php

namespace App\Http\Controllers;

use App\Form\FormValidation;
use App\Models\TimeRecord;
use App\Models\Timescale;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use function PHPUnit\Framework\isEmpty;

/**
 *
 */
class TimeRecordController extends Controller
{

    private $rules = [
        'entrada' => 'required',
        'almoco_saida' => 'required',
        'almoco_retorno' => 'required',
        'saida' => 'required',
        'data' => 'required'
    ];
    /**
     * METODO RESPONSAVEL POR RETORNAR TODOS OS PONTOS BATIDOS
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $this->auth();

        try {
            $timeRecords = TimeRecord::all();

            if (!$timeRecords) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            return response()->json($timeRecords);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL, POR RETORNAR TODOS OS REGISTROS DE PONTO DO USUARIO
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse|void
     */
    public function show(int $collaboratorId)
    {
        // VERIFICA SE E UM USUARIO AUTENTICADO
        $this->auth();

        // VERIFICA SE O USUARIO AUTENTICADO, E O COLABORADOR, OU POSSUI PRIVILEGIOS ADMINISTRADOR
        $user = $this->authAdmCheck();

        // VERIFICA SE O USUARIO ESTA TENTANDO BATER O PONTO DE OUTRA PESSOA, SEM TER PRIVILEGIOS DE ADM
        if ($user['collaborator']['id'] !== $collaboratorId && $user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        try {
            $timeRecords = TimeRecord::where('collaborator_id', $collaboratorId)->get();
            return response()->json($timeRecords);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL, POR REGISTRAR O PONTO DE ENTRADA
     * @param Request $request
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function entry(Request $request, int $collaboratorId)
    {
        // VERIFICA SE E UM USUARIO AUTENTICADO
        $this->auth();

        $user = $this->authAdmCheck();

        // VERIFICA SE O USUARIO ESTA TENTANDO BATER O PONTO DE OUTRA PESSOA, SEM TER PRIVILEGIOS DE ADM
        if ($user['collaborator']['id'] !== $collaboratorId && $user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        // SE NAO ESTIVER SETADO A DATA
        if (!$request['data']) {
            $request['data'] = date('Y/m/d');
        }

        try {
            $timeRecords = TimeRecord::select(['id', 'entrada', 'ponto_entrada_registrado'])->where('collaborator_id', $collaboratorId)->where('data', $request['data'])->first();

            if (!$timeRecords) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            // VERIFICA SE O PONTO DE ENTRADA JA FOI BATIDO HOJE
            if ($timeRecords['ponto_entrada_registrado']) {
                return response()->json(['message' => 'ponto de entrada ja batido']);
            }

            if(!$request['entrada']) {
                $timeRecords->entrada = Carbon::now()->format('H:i:s');
            }
            $timeRecords->entrada = Carbon::now()->format('H:i:s');
            $timeRecords->ponto_entrada_registrado = true;
            $timeRecords->save();

            return response()->json($timeRecords);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR REGISTRAR O PONTO DE REGISTRO DO ALMOCO
     * @param Request $request
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function lunch(Request $request, int $collaboratorId)
    {
        // VERIFICA SE E UM USUARIO AUTENTICADO
        $this->auth();

        // VERIFICA SE O USUARIO AUTENTICADO, E O COLABORADOR, OU POSSUI PRIVILEGIOS ADMINISTRADOR
        $user = $this->authAdmCheck();

        // VERIFICA SE O USUARIO ESTA TENTANDO BATER O PONTO DE OUTRA PESSOA, SEM TER PRIVILEGIOS DE ADM
        if ($user['collaborator']['id'] !== $collaboratorId && $user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        // SE NAO ESTIVER SETADO A DATA
        if (!$request['data']) {
            $request['data'] = date('Y/m/d');
        }

        try {
            $timeRecords = TimeRecord::select(['id', 'entrada', 'saldo_final', 'ponto_almoco_registrado'])->where('collaborator_id', $collaboratorId)->where('data', $request['data'])->first();

            if (!$timeRecords) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            // VERIFICA SE O PONTO DE ENTRADA JA FOI BATIDO HOJE
            if ($timeRecords['ponto_almoco_registrado']) {
                return response()->json(['message' => 'ponto de entrada ja batido']);
            }

            if (!$timeRecords['entrada']) {
                return response()->json(['message' => 'ponto de entrada nao batido']);
            }

            $timeRecords->almoco_saida = Carbon::now()->format('H:i:s');
            $timeRecords->ponto_almoco_registrado = true;
            $timeRecords->saldo_final = $this->calcHours(($this->calcHours($timeRecords->entrada, $timeRecords->almoco_saida)),$timeRecords->saldo_final);
            $timeRecords->save();

            return response()->json($timeRecords);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR REGISTRAR O PONTO DE RETORNO DO ALMOCO
     * @param Request $request
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function returnFromLunch(Request $request, int $collaboratorId)
    {
        // VERIFICA SE E UM USUARIO AUTENTICADO
        $this->auth();

        // VERIFICA SE O USUARIO AUTENTICADO, E O COLABORADOR, OU POSSUI PRIVILEGIOS ADMINISTRADOR
        $user = $this->authAdmCheck();

        // VERIFICA SE O USUARIO ESTA TENTANDO BATER O PONTO DE OUTRA PESSOA, SEM TER PRIVILEGIOS DE ADM
        if ($user['collaborator']['id'] !== $collaboratorId && $user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        // SE NAO ESTIVER SETADO A DATA
        if (!$request['data']) {
            $request['data'] = date('Y/m/d');
        }

        try {
            $timeRecords = TimeRecord::select(['id', 'almoco_saida', 'ponto_retorno_almoco_registrado'])->where('collaborator_id', $collaboratorId)->where('data', $request['data'])->first();

            if (!$timeRecords) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            // VERIFICA SE O PONTO DE ENTRADA JA FOI BATIDO HOJE
            if (!$timeRecords['almoco_saida']) {
                return response()->json(['message' => 'ponto de almoco nao batido!']);
            }

            if ($timeRecords['ponto_retorno_almoco_registrado']) {
                return response()->json(['message' => 'ponto ja registrado, hoje']);
            }

            $timeRecords->almoco_retorno = Carbon::now()->format('H:i:s');
            $timeRecords->ponto_retorno_almoco_registrado = true;
            $timeRecords->save();

            return response()->json($timeRecords);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR REGISTRAR O PONTO DE SAIDA
     * @param Request $request
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function exit(Request $request, int $collaboratorId)
    {
        // VERIFICA SE E UM USUARIO AUTENTICADO
        $this->auth();

        // VERIFICA SE O USUARIO AUTENTICADO, E O COLABORADOR, OU POSSUI PRIVILEGIOS ADMINISTRADOR
        $user = $this->authAdmCheck();

        // VERIFICA SE O USUARIO ESTA TENTANDO BATER O PONTO DE OUTRA PESSOA, SEM TER PRIVILEGIOS DE ADM
        if ($user['collaborator']['id'] !== $collaboratorId && $user['userPrivilege']['id'] !== 2) {
            return response()->json(['Unauthorized'], 401);
        }

        // SE NAO ESTIVER SETADO A DATA
        if (!$request['data']) {
            $request['data'] = date('Y/m/d');
        }

        try {
            $timeRecords = TimeRecord::where('collaborator_id', $collaboratorId)->where('data', $request['data'])->first();

            if (!$timeRecords) {
                return response()->json(['Recurso nao encontado'], 204);
            }

            // VERIFICA SE O PONTO DE ENTRADA JA FOI BATIDO HOJE
            if (!$timeRecords['almoco_retorno']) {
                return response()->json(['message' => 'ponto de retorno do almoco nao batido!']);
            }

            if ($timeRecords['ponto_saida_registrado']) {
                return response()->json(['message' => 'ponto ja registrado hoje']);
            }

            $timeRecords->saida = Carbon::now()->format('H:i:s');
            $timeRecords->ponto_saida_registrado = true;

            // Calcula a diferença de horas entre a volta do almoço e a saída
            $horasVoltaAlmoco = $this->calcHours($timeRecords->almoco_retorno, $timeRecords->saida);


            $user = Auth::user()->load('collaborator.timescale');

            // Soma o valor calculado ao saldo final existente
            $horasTrabalhadas = $this->sumHours($timeRecords->saldo_final, $horasVoltaAlmoco);

            $escalaEntrada = $user->collaborator->timescale->entrada;
            $escalaSaida = $user->collaborator->timescale->saida;

            $escala = $this->calcHours($escalaSaida, $escalaEntrada);

            $saldoFinal = $this->subHours($horasTrabalhadas, $escala);

            $timeRecords->saldo_final = $saldoFinal;

            $timeRecords->save();

            return response()->json($timeRecords);
        } catch (\Exception $exception) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }
    }

    /**
     * METODO RESPONSAVEL POR FAZER A REPARACAO DE UM ERRO DE REGISTRO, ALTERANDO TODAS AS DATAS
     * @param Request $request
     * @param int $collaboratorId
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateTimeRecords(Request $request, int $collaboratorId)
    {
        $validate = FormValidation::validar($request->all(), $this->rules);
        if ($validate !== true) {
            return $validate;
        }

        try {
            $timeRecords = TimeRecord::where('data', $request['data'])->where('collaborator_id', $collaboratorId)->first();
            $timeRecords->entrada = $request->entrada;
            $timeRecords->ponto_entrada_registrado = true;
            $timeRecords->almoco_saida = $request->almoco_saida;
            $timeRecords->ponto_almoco_registrado = true;
            $timeRecords->almoco_retorno = $request->almoco_retorno;
            $timeRecords->ponto_retorno_almoco_registrado = true;
            $timeRecords->saida = $request->saida;
            $timeRecords->ponto_saida_registrado = true;
            $timeRecords->saldo_final = 0;
            // SALDO DE HORAS DA ENTRADA, ATE A HORA DO ALMOCO
            $timeRecords->saldo_final = $this->calcHours(($this->calcHours($timeRecords->entrada, $timeRecords->almoco_saida)),$timeRecords->saldo_final);

            // Calcula a diferença de horas entre a volta do almoço e a saída
            $horasVoltaAlmoco = $this->calcHours($timeRecords->almoco_retorno, $timeRecords->saida);

            $user = Auth::user()->load('collaborator.timescale');

            // Soma o valor calculado ao saldo final existente
            $horasTrabalhadas = $this->sumHours($timeRecords->saldo_final, $horasVoltaAlmoco);

            $escalaEntrada = $user->collaborator->timescale->entrada;
            $escalaSaida = $user->collaborator->timescale->saida;

            $escala = $this->calcHours($escalaSaida, $escalaEntrada);

            $saldoFinal = $this->subHours($horasTrabalhadas, $escala);

            $timeRecords->saldo_final = $saldoFinal;

            $timeRecords->save();

            return response()->json($timeRecords);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Desculpe, algo deu errado']);
        }

    }

    /**
     * METODO RESPONSAVEL POR CALCULAR A DIFEREN;A ENTRE DOIS HORARIOS DIFERENTES
     * @param $start
     * @param $end
     * @return string
     */
    private function calcHours($start, $end) {
        $horaInicio = Carbon::parse($start);
        $horaFim = Carbon::parse($end);

        // Calcula a diferença entre as duas horas
        $diferenca = $horaFim->diff($horaInicio);

        // Acesso aos componentes individuais
        $horas = $diferenca->h;
        $minutos = $diferenca->i;
        $segundos = $diferenca->s;

        // Formatação
        $diferencaFormatada = $diferenca->format('%H:%I:%S');

        return $diferencaFormatada;
    }

    /**
     * METODO RESPONSAVEL, POR SOMAR AS HORAS
     * @param $time1
     * @param $time2
     * @return string
     */
    private function sumHours($time1, $time2)
    {
        $time1 = explode(':', $time1);
        $time2 = explode(':', $time2);

        $hours = intval($time1[0]) + intval($time2[0]);
        $minutes = intval($time1[1]) + intval($time2[1]);
        $seconds = intval($time1[2]) + intval($time2[2]);

        // Ajusta os valores para não ultrapassarem os limites
        $minutes += floor($seconds / 60);
        $seconds = $seconds % 60;
        $hours += floor($minutes / 60);
        $minutes = $minutes % 60;

        return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
    }

    private function subHours($workedHours, $dailyHours)
    {
        $workedHours = explode(':', $workedHours);
        $dailyHours = explode(':', $dailyHours);

        $totalSecondsWorked = intval($workedHours[0]) * 3600 + intval($workedHours[1]) * 60 + intval($workedHours[2]);
        $totalSecondsDaily = intval($dailyHours[0]) * 3600 + intval($dailyHours[1]) * 60 + intval($dailyHours[2]);

        $balanceSeconds = $totalSecondsWorked - $totalSecondsDaily;

        $negative = $balanceSeconds < 0;

        $hours = floor(abs($balanceSeconds) / 3600);
        $minutes = floor((abs($balanceSeconds) % 3600) / 60);
        $seconds = abs($balanceSeconds) % 60;

        // Aplica o sinal negativo, se necessário
        if ($negative) {
            $hours = -$hours;
            $minutes = -$minutes;
            $seconds = -$seconds;
        }

        return sprintf('%s%02d:%02d:%02d', ($negative ? '-' : ''), abs($hours), abs($minutes), abs($seconds));
    }

    /**
     * VERIFICA SE O USUARIO ESTA AUTENTICADO
     * @return \Illuminate\Http\JsonResponse|void
     */
    private function auth() {
        if (!Auth::check()) {
            return response()->json(['Unauthorized'], 401);
        }
    }

    /**
     * METODO RESPONSAVEL POR TRAZER OS DADOS ADICIONAIS DO COLABORADOR, COM OS PRIVILEGIOS, DADOS DO USUARIO E ETC
     * @return mixed
     */
    private function authAdmCheck(){
        return Auth::user()->load('userPrivilege')->load('collaborator');
    }
}
