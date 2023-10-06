<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class api_auth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $backend_token = $request->header('backendToken');

        if( $backend_token != config('app.backend_token')){
            return response()->json(['message' => 'Unauthorized'], 401);
        }else{
            return $next($request);
        }
    }
}
