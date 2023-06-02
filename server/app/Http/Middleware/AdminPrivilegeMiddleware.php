<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminPrivilegeMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // VERIFICA SE O USUARIO ESTA AUTENTICADO
        if ($request->user()) {
            // VERIFICA SE O USUARIO TEM PRIVILEGIOS DE ADMNISTRADOR
            if ($request->user()->user_privilege_id !== 2) {
                return \response()->json(['message' => 'acesso negado'], 403);
            }
        } else {
            return \response()->json(['message' => 'Nao autenticado'], 401);
        }
        return $next($request);
    }
}
